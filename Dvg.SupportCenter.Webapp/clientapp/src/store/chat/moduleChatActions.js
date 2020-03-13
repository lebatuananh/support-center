import { STATUS_CODES } from "http";
import settings from '../../statics/settings';
import contactRepository from '../../repositories/ContactRepository';
import conversationRepository from '../../repositories/ConversationRepository';

/*=========================================================================================
  File Name: moduleChatActions.js
  Description: Chat Module Actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

window.connection = null;

function decodeHtml(input) {
  var doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}
function trimSpaceHtml(input) {
  var result = input.replace(/&nbsp;/g, "").replace(/<br>/g, "").replace(/<div><\/div>/, "");
  return result;
}
function standardizeHtmlMessage(input) {
  var result = input
    .replace(/(<br>){2,}/g, "<br>")
    .replace(/^<div><br><\/div>/, "")
    .replace(/<div><br>*<\/div>$/, "")
    .replace(/^<br>/, "")
    .replace(/<br>$/, "")
    ;
  return result;
}

export default {
  async prepareXmppConnection({ rootState, dispatch, commit }, payload) {
    var currentUser = rootState.auth.currentUser;
    Strophe.SASLDvgAutoPortalToken = function () { };
    Strophe.SASLDvgAutoPortalToken.prototype = new Strophe.SASLMechanism(
      "DVG-AUTH",
      true,
      100
    );
    Strophe.SASLDvgAutoPortalToken.test = function (connection) {
      return connection.pass !== null;
    };
    Strophe.SASLDvgAutoPortalToken.prototype.onChallenge = function (
      connection
    ) {
      return currentUser.accessToken;
    };
    Strophe.Connection.prototype.mechanisms[
      Strophe.SASLDvgAutoPortalToken.prototype.name
    ] = Strophe.SASLDvgAutoPortalToken;

    window.connection = new Strophe.Connection(settings.boshService, {
      mechanisms: {
        "DVG-AUTH": 1000
      }
    });

    window.connection.rawInput = function (input) {
      dispatch("rawInput", input)
    };
    window.connection.rawOutput = function (output) {
      dispatch("rawOutput", output)
    };

    window.connection.xmlInput = function (input) {
      dispatch("handleXmlInput", input)
    }

    window.connection.addHandler(
      async function (message) {
        await dispatch("handleIncomingMessage", message);
      },
      null,
      "message",
      null,
      null,
      null,
      { matchBareFromJid: true, ignoreNamespaceFragment: true }
    );

    //window.connection.addHandler(
    //  async function (message) {
    //    await dispatch("handleInputForMessage", message);
    //  },
    //  null,
    //  null,
    //  null,
    //  null,
    //  null,
    //  { matchBareFromJid: true, ignoreNamespaceFragment: false }
    //);
    window.connection.addHandler(function (presence) {
      try {
        dispatch("handleSubscription", presence);
      }
      catch (exception) {
        console.log(exception);
      }
      return true;
    }, null, "presence", "subscribe");
    window.connection.addHandler(function (presence) {
      try {
        dispatch("handlePresence", presence);
      }
      catch (exception) {
        console.log(exception);
      }
      return true;
    }, null, "presence");
  },
  connect({ rootState, state, commit, dispatch }) {
    var currentUser = rootState.auth.currentUser;
    window.connection.connect(currentUser.username, "not-important", function (status) {
      dispatch("handleConnectionStatusChange", status);
    });

  },
  handleXmlInput({ commit, dispatch }, xmlInput) {
    console.log("============================== XML input: ")
    console.log(xmlInput);

    var presences = xmlInput.getElementsByTagName('presence');
    var messages = xmlInput.getElementsByTagName('message');

    if (presences && presences.length > 0 && messages && messages.length > 0) {
      console.log("INPUT HAVE BOTH PRESENCE AND MESSAGE");
      for (let i = 0; i < messages.length; i++) {
        xmlInput.removeChild(messages[i]);
      }
    }
  },
  handleConnectionStatusChange({ state, dispatch, commit }, status) {
    if (status == Strophe.Status.CONNECTING) {
      this.log("Strophe is connecting.");
    } else if (status == Strophe.Status.CONNFAIL) {
      this.log("Strophe failed to connect.");
    } else if (status == Strophe.Status.DISCONNECTING) {
      this.log("Strophe is disconnecting.");
    } else if (status == Strophe.Status.DISCONNECTED) {
      this.log("Strophe is disconnected.");
    } else if (status == Strophe.Status.CONNECTED) {
      console.log("Strophe is connected.");
      console.log("jid = " + window.connection.jid); // full JID

      var jid = {
        id: Strophe.getBareJidFromJid(window.connection.jid),
        resource: Strophe.getResourceFromJid(window.connection.jid),
        jid: window.connection.jid
      };

      dispatch("connectSuccessfully", jid);
      // set presence
      window.connection.send($pres());
      // set handlers

      //connection.addHandler(this.onSubscriptionRequest, null, "presence", "subscribe");
      //connection.addHandler(onPresence, null, "presence");

      // connection.muc.join(
      //   "ap_support@conference.ap.openfire.vn",
      //   this.connection.jid
      // );
      dispatch("acceptCarbonMessage");

      state.contactManager.contacts.forEach(contact => {
        dispatch('subscribeContactPresence', contact);
        commit("putContact", contact)
      })
    }
    return true;
  },
  acceptCarbonMessage({ state }) {
    {
      var iq = $iq({
        type: 'set',
        xmlns: 'jabber:client',
        from: connection.jid,
        //to: 'xmpp.com',
        'xml:lang': 'en'
      }).c(
        'enable',
        {
          xmlns: 'urn:xmpp:carbons:2'
        });
      connection.sendIQ(iq);
    }
  },

  //handleInputForMessage({ state, dispatch, commit }, body) {
  //  console.log('HANDLE INPUT FOR MESSAGE')
  //  var doc = new DOMParser().parseFromString(body, "text/xml");

  //  var presences = doc.getElementsByTagName('presence');
  //  var messages = doc.getElementsByTagName('message');

  //  if (presences && presences.length > 0 && messages && messages.length > 0) {
  //    return true;
  //  }

  //  for (let i = 0; i < messages.length; i++) {
  //    let message = messages[i];
  //    dispatch("handleIncomingMessage", message);
  //  }
  //},

  async handleIncomingMessage({ state, dispatch, commit }, receivedMessage) {
    try {
      console.log('handling')
      var to = null;
      var from = null;
      var content = null;

      //var forwardedElements = receivedMessage.getElementsByTagName(
      //  "message forwarded"
      //);
      //if (forwardedElements.length > 0) {
      //  //   this.handleForwardedMessage(forwardedElements[0]);
      //  return;
      //}

      var forwardedStanzas = receivedMessage.getElementsByTagName('forwarded');
      if (forwardedStanzas.length > 0) {
        var forwardedStanza = forwardedStanzas[0].getElementsByTagName('message')[0];
        console.log("HANDLE FORWARDED MESSAGE", forwardedStanza);

        var forwardedContent = decodeHtml(
          Strophe.getText(
            forwardedStanza.getElementsByTagName("body")[0]
          )
        );
        var element = forwardedStanza;
        var origToJid = element.getAttribute("to");
        var origToBareJid = Strophe.getBareJidFromJid(origToJid);
        var origToUsername = Strophe.getNodeFromJid(origToJid);
        console.log(origToBareJid);

        //var forwardedMessage = new Chat.conversationManager.Message(
        //  new Date().getTime(),
        //  forwardedContent,
        //  'html',
        //  'out'
        //);

        var forwardedMessage = {
          content: forwardedContent,
          contentType: "html",
          time: new Date().getTime(),
          isSent: true,
          isSeen: false
        }
        var forwardedContact = state.contactManager.contacts.find(c => c.username == origToUsername);
        var forwardedPayload = {
          contact: forwardedContact,
          message: forwardedMessage
        }
        commit("addMessage", forwardedPayload);
       
        return true;
      }

      to = receivedMessage.getAttribute("to");
      from = receivedMessage.getAttribute("from");
      var type = receivedMessage.getAttribute("type");
      content = Strophe.getText(
        receivedMessage.getElementsByTagName("body")[0]
      );
      content = decodeHtml(content);

      if (type != "chat")
        return;

      var sender = {
        bareJid: Strophe.getBareJidFromJid(from),
        username: Strophe.getNodeFromJid(from),
        resource: Strophe.getResourceFromJid(from),
        jid: from,
        name: Strophe.getNodeFromJid(from)
      };

      let message = {
        time: (new Date()).getTime(),
        content: content,
        contentType: "html",
        isSent: false,
        isSeen: false
      };

      let payload = {
        contact: sender,
        message: message
      };

      dispatch("receiveMessage", payload);

      return true;
    }
    catch (ex) {
      console.log(ex);
    }
    return true;

  },
  async handlePresence({ state, commit}, presence) {
    var presenceType = $(presence).attr('type'); // unavailable, subscribed, etc...
    var from = $(presence).attr('from'); // the jabber_id of the contact
    var username = Strophe.getNodeFromJid(from);

    //if (username == Strophe.getNodeFromJid(window.connection.jid)) {
    //  window.connection.send($pres());
    //  return true;
    //}

    if (!presenceType)
      presenceType = "online";
    if (presenceType != 'error') {
      if (presenceType === 'unavailable') {
        // Mark contact as offline
        console.log(`contact ${username} OFFLINE`)
        commit("changeContactPresenceStatus", {username: username, presenceStatus: "offline"})
        
      } else {
        var show = $(presence).find("show").text(); // this is what gives away, dnd, etc.
        if (show === 'chat' || show === '') {
          // Mark contact as online
          console.log(`contact ${username} ONLINE`)
          commit("changeContactPresenceStatus", { username: username, presenceStatus: "online" })
        } else {
          // etc...

        }
      }
    }

    if ((username == Strophe.getNodeFromJid(window.connection.jid)) && (presenceType === 'unavailable')) {
      window.connection.send($pres());
      return true;
    }
  },
  async handleSubscription({ state }, stanza) {
    if (stanza.getAttribute("type") == "subscribe") {
      var from = $(stanza).attr('from');
      // Send a 'subscribed' notification back to accept the incoming
      // subscription request

      window.connection.send($pres({
        to: from,
        type: "subscribed"
      }));
    }
    return true;
  },
  rawInput({ state }, input) {
    console.log("--------in");

    console.log(input);

    //var doc = new DOMParser().parseFromString(input, "text/xml");

    //var presences = doc.getElementsByTagName('presence');
    //var messages = doc.getElementsByTagName('message');

    //if (presences && presences.length > 0 && messages && messages.length > 0) {
    //  console.log("INPUT HAVE BOTH PRESENCE AND MESSAGE");
    //}
    //var bonus = doc.createElement('hoinx');
    //bonus.textContent = 'Pha này bỏ qua nhé'
    //doc.children[0].append(bonus)

    //input = doc.children[0].outerHTML;
    return true;
  },
  rawOutput({ state }, output) {
     console.log("--------out");
     console.log(output);
    return true;
  },

  updateAboutChat({ commit, rootState }, value) {
    commit('UPDATE_ABOUT_CHAT', { rootState: rootState, value: value })
  },
  updateStatusChat({ commit, rootState }, value) {
    commit('UPDATE_STATUS_CHAT', { rootState: rootState, value: value })
  },
  setChatSearchQuery({ commit }, query) {
    commit('SET_CHAT_SEARCH_QUERY', query)
  },
  toggleIsPinned({ commit }, payload) {
    commit('TOGGLE_IS_PINNED', payload);
  },
  markSeenAllMessages({ getters, commit }, id) {
    let payload = { id: id }
    payload.chatData = getters.chatDataOfUser(payload.id);
    commit('MARK_SEEN_ALL_MESSAGES', payload);
  },
  connectSuccessfully({ commit, dispatch }, payload) {
    commit("CONNECT_SUCCESS", payload);
    dispatch("getRecentContacts");
  },
  async receiveMessage({ commit, getters, dispatch, state }, payload) {
    var contacts = state.contactManager.contacts;
    var messageContact = payload.contact;
    var contact = contacts.find(c => c.username == messageContact.username);

    if (contact) {
      commit("increaseUnreadMessageCount", { contactUsername: contact.username, increment: 1 });
    }
    else {
      var user = await contactRepository.getUser(messageContact.username);
      contact = {
        bareJid: messageContact.jid,
        resource: messageContact.resource,
        jid: messageContact.jid,
        username: user.userName,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        avatarUrl: user.avatarUrl,
        groupIds: user.groupIds,
        lastMessageAt: user.lastMessageAt ? user.lastSeenMessageAt : 0,
        lastSeenMessageAt: user.lastSeenMessageAt
          ? user.lastSeenMessageAt
          : new Date().getTime(),
        unreadMessageCount: 1,
        status: 'online'
      }

      dispatch('subscribeContactPresence', contact);
      commit('putContact', contact);
    }

    if ((!payload.message.isSent) && payload.message.time < contact.lastSeenMessageAt) {
      payload.message.isSeen = true;
    }

    commit('moveContactToTop', contact);
    commit('addMessage', payload);

  },
  activateChatContact({ commit, state, dispatch }, username) {
    dispatch("getMessageHistory", username);
    commit("activateContact", username);
  },
  async getMessageHistory({ commit, rootState, state, dispatch }, username) {
    console.log('get message history')
    var contact = state.contactManager.contacts.find(c => c.username == username);
    var conversation = state.conversationManager.conversations[username];
    
    commit("updateConversationHistoryLoaded", { username: username });

    if (!conversation.historyAvailable) {
      console.log('but history is not available')
      return;
    }


    var params = {
      page: 1,
      limit: 20,
      maxSentDate: (conversation.messages.length == 0) ? new Date().getTime() : conversation.firstMessageAt,
      partnerJid: contact.bareJid
    }
    var messages = await conversationRepository.getMessageHistory(username, params);

    if (messages.length < 20) {
      commit("updateConversationHistoryAvailable", { username: username, historyAvailable: false });
    }

    var payload = {
      username: username,
      messages: messages
    }

    console.log('getted, continue by processing result')
    dispatch("processMessageHistory", payload);


  },

  async processMessageHistory({ commit, rootState, state, dispatch }, payload) {
    var username = payload.username;
    var contact = state.contactManager.contacts.find(c => c.username == username);
    var receivedMessages = payload.messages;
    if (receivedMessages && receivedMessages.length > 0) {
      var firstMessage = receivedMessages[receivedMessages.length - 1];
      var firstMessageAt = firstMessage.sentDate;

      var commitFirstMessageTime = {
        username: username,
        firstMessageAt: firstMessageAt
      }
      commit("updateConversationFirstMessageTime", commitFirstMessageTime);
    }

    var messages = receivedMessages.map(m => {
      var isSent = false;
      var senderUsername = Strophe.getNodeFromJid(m.fromJID);
      if (senderUsername == rootState.auth.currentUser.username)
        isSent = true;

      var isSeen = false;
      if ((!isSent) && m.sentDate < contact.lastSeenMessageAt) {
        isSeen = true;
      }

      console.log(isSeen);
      var message = {
        time: m.sentDate,
        content: m.body,
        contentType: "html",
        isSent: isSent,
        isSeen: isSeen
      }
      return message;
    });

    commit("prependListOldMessage", {
      username: username,
      messages: messages
    });

    for (let i = 0; i < messages.length; i++) {
      let message = messages[i];
      if (!(message.isSent || message.isSeen)) {
        dispatch("getMessageHistory", username)
        break;
      }
    }
  },

  async getRecentContacts({ commit, rootState, state, dispatch }, payload) {
    let unreadMessageCount = await conversationRepository.getUnreadMessageCount();
    let unreadMessagePartnerCounts = unreadMessageCount.partners;

    var time = state.contactManager.time;
    var userGroups = rootState.auth.currentUser.partnerGroups;
    var groupIds = [];
    groupIds = groupIds.concat(userGroups.supporterGroupIds);
    groupIds = groupIds.concat(userGroups.buyerGroupIds);
    groupIds = groupIds.concat(userGroups.sellerGroupIds);
    var recentContactResult = await contactRepository.getRecentContacts(
      {
        page: 1,
        limit: 20,
        user_group_ids: groupIds.join(","),
        before_time: time
      }
    );
    console.log(recentContactResult.users)
    var contacts = recentContactResult.users.map(user => {
      let contact = {
        bareJid: user.userName + "@" + settings.xmppDomain,
        resource: null,
        jid: user.userName + "@" + settings.xmppDomain,
        username: user.userName,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        avatarUrl: user.avatarUrl,
        groupIds: user.groupIds,
        lastMessageAt: user.lastMessageAt ? user.lastSeenMessageAt : 0,
        lastSeenMessageAt: user.lastSeenMessageAt
          ? user.lastSeenMessageAt
          : 0,
        updateLastSeenMessageTime: false,
        unreadMessageCount: 0,
        status: 'offline'
      };

      var contactUnreadMessageCount = unreadMessagePartnerCounts.find(f => f.partnerBareJid == contact.bareJid);
      console.log(contactUnreadMessageCount)
      if (contactUnreadMessageCount) {
        contact.unreadMessageCount = contactUnreadMessageCount.count;
      }

      return contact;
    });

    contacts.forEach(contact => {
      dispatch('subscribeContactPresence', contact);
      commit("putContact", contact);
    });
  },
  changeTypedMessage({ commit }, payload) {
    commit("changeTypedMessage", payload);
  },
  sendMessage({ state, commit }) {
    var content = state.conversationManager.activeConversation.typedMessage;
    //content = decodeHtml(content).trim();
    //content = content.trim();
    //console.log(content);
    //debugger
    var textContent = trimSpaceHtml(content).trim();
    if (!textContent || textContent == '')
      return true;

    content = standardizeHtmlMessage(content.trim());

    if (!content || content == '')
      return true;

    var contact = state.contactManager.contacts.find(c => c.username == state.contactManager.activeContactUsername);

    var sentMessage = $msg({
      to: contact.bareJid,
      from: window.connection.jid,
      type: "chat"
    })
      .c("body")
      .t(content);

    window.connection.send(sentMessage);

    var message = {
      content: content,
      contentType: "html",
      time: new Date().getTime(),
      isSent: true,
      isSeen: false
    }
    var payload = {
      contact: contact,
      message: message
    }
    commit("addMessage", payload);
    commit("resetCurrentConversationTypedMessage")
  },
  readMessage({ state, commit }, time) {
    var username = state.contactManager.activeContactUsername;
    var conversation = state.conversationManager.conversations[username];
    conversation.messages.forEach(message => {
      if (!message.isSent && !message.isSeen && message.time <= time) {
        commit("increaseUnreadMessageCount", { contactUsername: username, increment: -1 });
      }
    });

    commit("updateLastReadMessageTime", time)
  },
  doUpdateReadMessageTime({ state, commit }) {
    setInterval(async function () {
      var contactUsername = state.contactManager.activeContactUsername;
      var contact = state.contactManager.contacts.find(c => c.username == contactUsername);
      if (!contact.updateLastSeenMessageTime) {
        return;
      }

      await conversationRepository.updateReadTime(contactUsername, contact.lastSeenMessageAt);
      commit("clearUpdateReadMessageTimeQueue")
    }, 5000)
  },
  subscribeContactPresence({ state, commit }, payload) {
    console.log("SUBCRIBE ", payload.bareJid)
    var connection = window.connection;
    connection.send($pres({
      to: payload.bareJid,
      type: "subscribe"
    }));
  },
  clear({ commit }) {
    window.connection.disconnect("logout");
    commit("resetState");
  }
}
