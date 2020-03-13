/*=========================================================================================
  File Name: moduleChatMutations.js
  Description: Chat Module Mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue';
import cloneDeep from 'lodash/cloneDeep';

const initialState = {
  jid: {
    id: '',
    resource: '',
    jid: ''
  },
  chatSearchQuery: '',
  activeConversation: null,
  contactManager: {
    activeContactUsername: null,
    time: (new Date()).getTime(),
    contacts: []
  },
  conversationManager: {
    conversations: {},
    activeConversation: {}
  }
}

export default {
  UPDATE_ABOUT_CHAT(state, obj) {
    obj.rootState.AppActiveUser.about = obj.value;
  },
  UPDATE_STATUS_CHAT(state, obj) {
    obj.rootState.AppActiveUser.status = obj.value;
  },
  SET_CHAT_SEARCH_QUERY(state, query) {
    state.chatSearchQuery = query;
  },
  SEND_CHAT_MESSAGE(state, payload) {
    if (payload.chatData) {
      state.chats[Object.keys(state.chats).find(key => key == payload.id)].msg.push(payload.msg);
    } else {
      const chatId = payload.id;
      Vue.set(state.chats, [chatId], { isPinned: payload.isPinned, msg: [payload.msg] });
    }
  },
  TOGGLE_IS_PINNED(state, payload) {
    state.chats[Object.keys(state.chats).find(key => key == payload.id)].isPinned = payload.value;
  },
  MARK_SEEN_ALL_MESSAGES(state, payload) {
    payload.chatData.msg.forEach((msg) => {
      msg.isSeen = true
    });
  },
  CONNECT_SUCCESS(state, payload) {
    state.jid.id = payload.id;
    state.jid.resource = payload.resource;
    state.jid.jid = payload.jid;
  },
  addMessage(state, payload) {
    console.log("CHAT MUTATION ADDMESSAGE")
    var conversation = state.conversationManager.conversations[payload.contact.username];

    if (!conversation.historyLoaded) {
      return true;
    }

    conversation.messages.push(payload.message);
    conversation.lastMessageAt = payload.message.time;
  },
  putContact(state, newContact) {
    var existContact = state.contactManager.contacts.find(contact => {
      return contact.username == newContact.username;
    })
    if (existContact) {
      
      return true;
    }
      
    state.contactManager.contacts.push(newContact);
    //state.contactManager.contacts.unshift(newContact);
    state.conversationManager.conversations[newContact.username] = {
      lastMessageAt: null,
      firstMessageAt: new Date().getTime(),
      historyAvailable: true,
      historyLoaded: false,
      typedMessage: '',
      messages: [

      ]
    }
  },
  moveContactToTop(state, existContact) {
    for (let i = 0; i < state.contactManager.contacts.length; i++) {
      let contact = state.contactManager.contacts[i];
      if (contact.username === existContact.username) {
        state.contactManager.contacts.splice(i, 1);
        break;
      }
    }
    state.contactManager.contacts.unshift(existContact);
  },
  activateContact(state, username) {
    state.contactManager.activeContactUsername = username;

    state.conversationManager.activeConversation = state.conversationManager.conversations[username];
  },
  changeTypedMessage(state, messageContent) {
    state.conversationManager.activeConversation.typedMessage = messageContent;
  },
  resetCurrentConversationTypedMessage(state) {
    state.conversationManager.activeConversation.typedMessage = ''
  },
  updateConversationHistoryAvailable(state, payload) {
    var conversation = state.conversationManager.conversations[payload.username];
    conversation.historyAvailable = payload.historyAvailable;
  },
  updateConversationHistoryLoaded(state, payload) {
    var conversation = state.conversationManager.conversations[payload.username];
    conversation.historyLoaded = true;
  },
  updateConversationFirstMessageTime(state, payload) {
    var conversation = state.conversationManager.conversations[payload.username];
    conversation.firstMessageAt = payload.firstMessageAt;
  },
  prependListOldMessage(state, payload) {
    var conversation = state.conversationManager.conversations[payload.username];

    for (let i = 0; i < payload.messages.length; i++) {
      var message = payload.messages[i]
      conversation.messages.unshift(message);
    }
  },
  updateLastReadMessageTime(state, time) {
    var username = state.contactManager.activeContactUsername;
    var contact = state.contactManager.contacts.find(c => c.username == username);
    if (contact.lastSeenMessageAt < time) {
      contact.lastSeenMessageAt = time;
      contact.updateLastSeenMessageTime = true;
    }
    else {
      //console.log("contact.lastSeenMessageAt", contact.lastSeenMessageAt);
      //console.log(">= ", time)
    }
    var conversation = state.conversationManager.conversations[username];
    conversation.messages.forEach(message => {
      if (!message.isSent && message.time <= time) {
        message.isSeen = true;
      }
    });
  },
  clearUpdateReadMessageTimeQueue(state) {
    var username = state.contactManager.activeContactUsername;
    var contact = state.contactManager.contacts.find(c => c.username == username);
    contact.updateLastSeenMessageTime = false;
  },
  increaseUnreadMessageCount(state, payload) {
    var contact = state.contactManager.contacts.find(c => c.username == payload.contactUsername);
    contact.unreadMessageCount += payload.increment;
  },
  changeContactPresenceStatus(state, payload) {
    var contact = state.contactManager.contacts.find(c => c.username == payload.username);
    if(contact)
      contact.status = payload.presenceStatus;
  },
  resetState(state) {
    var newState = cloneDeep(initialState);
    Object.assign(state, newState);
  }
}
