<template>
  <div id="chat-app"
       class="border border-solid d-theme-border-grey-light rounded relative overflow-hidden">
    <vs-sidebar class="items-no-padding"
                parent="#chat-app"
                :click-not-close="clickNotClose"
                :hidden-background="clickNotClose"
                v-model="isChatSidebarActive"
                id="chat-list-sidebar">
      <!-- USER PROFILE SIDEBAR -->
       <user-profile
        :active="references.contactProfileSidebar.active"
        class="user-profile-container"
        @closeProfileSidebar="closeContactProfileSidebar"
      ></user-profile> 
      <!-- <div class="chat__profile-search flex p-4">
        <div class="relative inline-flex">
          <vs-avatar
            class="m-0 border-2 border-solid border-white"
            :src="activeUserImg"
            size="40px"
          />
          <div
            class="h-3 w-3 border-white border border-solid rounded-full absolute right-0 bottom-0"
            :class="'bg-' + 'green'"
          ></div>
        </div>
        <vs-input
          icon="icon-search"
          icon-pack="feather"
          class="w-full mx-5 input-rounded-full no-icon-border"
          placeholder="Search or start a new chat"
          v-model="searchQuery"
        />
      </div> -->

      <vs-divider class="d-theme-border-grey-light m-0" />
      <VuePerfectScrollbar class="chat-scroll-area pt-4" :settings="settings">
        <!-- ACTIVE CHATS LIST -->
        <!-- <div class="chat__chats-list mb-8">
          <h3 class="text-primary mb-5 px-4">Chats</h3>
          <ul class="chat__active-chats bordered-items">
            <li
              class="cursor-pointer"
              v-for="(contact, index) in sorted"
              :key="index"
              @click="updateActiveChatUser(contact.id)"
            >
              <chat-contact
                :contact="contact"
                :lastMessaged="chatLastMessaged(contact.id).time"
                :unseenMsg="chatUnseenMessages(contact.id)"
                :isActiveChatUser="isActiveChatUser(contact.id)"
              ></chat-contact>
            </li>
          </ul>
        </div>-->
        <!-- CONTACTS LIST -->
        <div class="chat__contacts">
          <h3 class="text-primary mb-5 px-4">Contacts</h3>
          <ul class="chat__contacts bordered-items">
            <li class="cursor-pointer"
                v-for="contact in contacts"
                :key="contact.username"
                @click="activateContact(contact.username)">
              <chat-contact :contact="contact"></chat-contact>
            </li>
          </ul>
        </div>
      </VuePerfectScrollbar>
    </vs-sidebar>

    <!-- RIGHT COLUMN -->
    <div class="chat__bg app-fixed-height chat-content-area border border-solid d-theme-border-grey-light border-t-0 border-r-0 border-b-0"
         :class="{'sidebar-spacer--wide': clickNotClose, 'flex items-center justify-center': false}">
      <template v-if="activeContact">
        <div class="chat__navbar">
          <chat-navbar :isSidebarCollapsed="!clickNotClose"
                       :isPinnedProp="isChatPinned"
                       @openContactsSidebar="toggleChatSidebar(true)"
                       @showProfileSidebar="updateUserProfileType('activeContact')"
                       @toggleIsChatPinned="toggleIsChatPinned"></chat-navbar>
        </div>
        <VuePerfectScrollbar class="chat-content-scroll-area border border-solid d-theme-border-grey-light"
                             :settings="settings"
                             ref="chatLogPS"
                             @ps-scroll-y="onChatLogScroll()">
          <div class="chat__log">
            <chat-log ref="chatLogComponent"></chat-log>
          </div>
        </VuePerfectScrollbar>
        <chat-input-message></chat-input-message>
      </template>
      <template v-else>
        <div class="flex flex-col items-center">
          <feather-icon icon="MessageSquareIcon"
                        class="mb-4 bg-white p-8 shadow-md rounded-full"
                        svgClasses="w-16 h-16"></feather-icon>
          <h4 class="py-2 px-4 bg-white shadow-md rounded-full cursor-pointer"
              @click.stop="toggleChatSidebar(true)">
            Start Conversation
          </h4>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import VuePerfectScrollbar from "vue-perfect-scrollbar";
  import ChatContact from "./ChatContact.vue";
  import UserProfile from "./UserProfile.vue";
  import ChatNavbar from "./ChatNavbar.vue";
  import ChatLog from "./ChatLog.vue";
  import ChatInputMessage from "./ChatInputMessage.vue";
  import userStatuses from "../../statics/userStatus";

  export default {
    name: "vx-sidebar",
    data() {
      var refs = {
        contactProfileSidebar: {
          active: false
        }
      }
      return {
        connection: null,
        loggedMessages: [],
        userProfile: null,
        active: true,
        isHidden: false,
        searchContact: "",
        activeChatUser: null,
        userProfileId: "",
        typedMessage: "",
        isChatPinned: false,
        settings: {
          maxScrollbarLength: 60,
          wheelSpeed: 0.5
        },
        clickNotClose: true,
        isChatSidebarActive: true,
        windowWidth: window.innerWidth,
        userProfileType: "",
        chatSettings: {
          boshService: "http://127.0.0.1:7070/http-bind/"
        },
        contacts: [],
        scripts: [
          "/lib/jquery/dist/jquery.min.js",
          "/lib/strophe/strophe.js",
          "/lib/strophe/strophe-muc.js",
          "/lib/strophe/strophe.si-filetransfer.js",
          "/lib/strophe/strophe.ibb.js",
          "/lib/emojionearea/emojionearea.min.js"
        ],
        lastScriptIndex: 0,
        references: refs
      };
    },
    async mounted() {
      this.loadScripts();
      
    },
    computed: {
      activeContact() {
        var contact = this.$store.state.chat.contactManager.contacts.find(
          contact => contact.username == this.$store.state.chat.contactManager.activeContactUsername
        );
        console.log(contact);
        return contact;
      },
      chatLastMessaged() {
        return userId => this.$store.getters["chat/chatLastMessaged"](userId);
      },
      chatUnseenMessages() {
        return userId => {
          const unseenMsg = this.$store.getters["chat/chatUnseenMessages"](
            userId
          );
          if (unseenMsg) return unseenMsg;
        };
      },
      sorted() {
        return this.chats.slice().sort((x, y) => {
          const xId = x.id;
          const yId = y.id;
          const chatDataX = this.$store.getters["chat/chatDataOfUser"](xId);
          const chatDataY = this.$store.getters["chat/chatDataOfUser"](yId);
          return chatDataY.isPinned - chatDataX.isPinned;
        });
      },

      activeUserId() {
        return this.$store.state.auth.user.username;
      },
      activeUserImg() {
        let user = JSON.parse(localStorage.getItem("userInfo"));
        console.log(user);
        return user.avatarUrl;
      },
      activeUserStatus() {
        return this.$store.state.AppActiveUser.status;
      },
      getStatusColor() {
        var userStatus = 'online';

        if (userStatus == userStatuses.online) {
          return "success";
        } else if (userStatus == userStatuses.notDisturb) {
          return "danger";
        } else if (userStatus == userStatuses.away) {
          return "warning";
        } else {
          return "grey";
        }
      },
      conversation() {
        return this.$store.state.chat.conversations.find(c => c.active);
      },

      searchQuery: {
        get() {
          return this.$store.state.chat.chatSearchQuery;
        },
        set(val) {
          this.$store.dispatch("chat/setChatSearchQuery", val);
        }
      },
      isActiveChatUser() {
        return userId => userId == this.activeChatUser;
      }
    },
    methods: {
      loadScripts(callback) {

        let that = this;
        this.$loadScript(that.scripts[that.lastScriptIndex])
          .then(() => {
            console.log(
              "load script successfully: " + that.scripts[that.lastScriptIndex]
            );
            if (that.lastScriptIndex == that.scripts.length - 1) {
              if (callback) callback();
              this.$store.dispatch("chat/prepareXmppConnection");
              this.$store.dispatch("chat/connect");
            } else {
              that.lastScriptIndex = that.lastScriptIndex + 1;
              that.loadScripts();
            }
          })
          .catch(exception => {
            console.log(exception);
            console.log(
              "fail to load script: " + that.scripts[that.lastScriptIndex]
            );
          });
      },

      log(message) {
        this.loggedMessages.unshift(message);
      },
      onChatLogScroll() {
        console.log('scroll');
        console.log(this.$refs.chatLogPS.$el.scrollHeight + " - " + this.$refs.chatLogPS.$el.scrollTop)
        this.$refs.chatLogComponent.readTo(this.$refs.chatLogPS.$el.clientHeight + this.$refs.chatLogPS.$el.scrollTop);
      },
      handleRoomPresence(presence) {
        console.log("receive presence from room:");
        // console.log(presence)
        // var jid = $(presence).find('x>item').attr('jid');
        // chat.log('--' + jid);
        // var bareJid = Strophe.getBareJidFromJid(jid);
        // chat.log('--' + bareJid);

        // if (bareJid == Strophe.getBareJidFromJid(chat.connection.jid)) {
        //     return true;
        // }

        // var userName = bareJid.split('@')[0];
        // $.ajax({
        //     url: chatSettings.baseUrl + chatSettings.pathPrefix + "/users/" + userName,
        //     beforeSend: function (xhr) {
        //         /* Authorization header */
        //         xhr.setRequestHeader("Authorization", "Bearer " + chat.data.me.AccessToken);
        //     },
        //     success: function (xmppUser) {
        //         if (!xmppUser.supporter)
        //             return true;

        //         var participant = new Participant(xmppUser, jid);
        //         participant.presenceStatus = presenceStatuses.ONLINE;
        //         chat.putParticipant(participant);
        //         return true;
        //     },
        //     error: function (exception) {
        //         console.log(exception);
        //         return true;
        //     }
        // })

        return true;
      },
      handleForwardedMessage(forwaredMessage) {
        // var to = receivedMessage.getAttribute('to');
        // var from = receivedMessage.getAttribute('from');
        // var type = receivedMessage.getAttribute('type');
        // var content = Strophe.getText(receivedMessage.getElementsByTagName('body')[0]);
        // if (type != 'chat')
        //     return true;
        // var sender = {
        //     id: Strophe.getBareJidFromJid(from),
        //     resource: Strophe.getResourceFromJid(from),
        //     jid: from
        // };
        // let message = {
        //     sender: sender,
        //     receiver: this.$store.state.home.me,
        //     sentAt: new Date(),
        //     content: content,
        //     contentType: 'text',
        //     seen: false,
        //     direction: 'in'
        // };
        // console.log(message);
        // this.$store.dispatch('home/MESSAGE_RECEIVED', message)
      },
      prepareStropheSaslDvgAutoPortalToken() {
        let component = this;
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
          return component.userProfile.accessToken;
        };
        Strophe.Connection.prototype.mechanisms[
          Strophe.SASLDvgAutoPortalToken.prototype.name
        ] = Strophe.SASLDvgAutoPortalToken;
      },
      getUserStatus(isActiveUser) {
        return isActiveUser
          ? this.$store.state.AppActiveUser.status
          : this.contacts[this.activeChatUser].status;
      },
      closeContactProfileSidebar(value) {
        this.references.contactProfileSidebar.active = false;
      },
      updateUserProfileType(type) {
        this.userProfileType = type;
        this.activeProfileSidebar = !this.activeProfileSidebar;
      },
      activateContact(username) {
        this.$store.dispatch("chat/activateChatContact", username);
        // this.activeChatUser = contactId;
        // if (this.$store.getters["chat/chatDataOfUser"](this.activeChatUser)) {
        //   this.$store.dispatch("chat/markSeenAllMessages", contactId);
        // }
        // let chatData = this.$store.getters["chat/chatDataOfUser"](
        //   this.activeChatUser
        // );
        // console.log(chatData);
        // if (chatData) this.isChatPinned = chatData.isPinned;
        // else this.isChatPinned = false;
        // this.toggleChatSidebar();
        // this.typedMessage = "";
      },
      showContactProfileSidebar(userId) {
        this.userProfileId = userId;
        this.activeProfileSidebar = !this.activeProfileSidebar;
      },
      sendMsg() {
        if (!this.typedMessage) return;

        var message = $msg({
          to: this.activeContact.id,
          from: this.connection.jid,
          type: "chat"
        })
          .c("body")
          .t(this.typedMessage);
        this.connection.send(message);

        const payload = {
          contact: this.activeContact,
          message: {
            content: this.typedMessage,
            contentType: "text",
            time: new Date(),
            isSent: true,
            isSeen: false
          }
        };
        this.$store.dispatch("chat/sendMessage", payload);
        this.typedMessage = "";
        this.$refs.chatLogPS.$el.scrollTop = this.$refs.chatLog.scrollHeight;
      },
      toggleIsChatPinned(value) {
        this.isChatPinned = value;
      },
      handleWindowResize(event) {
        this.windowWidth = event.currentTarget.innerWidth;
        this.setSidebarWidth();
      },
      setSidebarWidth() {
        if (this.windowWidth < 1200) {
          this.isChatSidebarActive = this.clickNotClose = false;
        } else {
          this.isChatSidebarActive = this.clickNotClose = true;
        }
      },
      toggleChatSidebar(value = false) {
        if (!value && this.clickNotClose) return;
        this.references.contactProfileSidebar.active = value;
      }
    },
    components: {
      VuePerfectScrollbar,
      ChatContact,
      UserProfile,
      ChatNavbar,
      ChatLog,
      ChatInputMessage
    },
    created() {
      this.$store.subscribe((mutation, state) => {
        if (state.chat.contactManager.contacts)
          this.contacts = state.chat.contactManager.contacts;
      });
      this.$nextTick(() => {
        window.addEventListener("resize", this.handleWindowResize);
      });
      this.setSidebarWidth();
    },
    beforeDestroy: function () {
      window.removeEventListener("resize", this.handleWindowResize);
    }
  };
</script>

<style lang="scss">

  @import "@/assets/scss/vuesax/apps/chat.scss";
  @import "@/assets/scss/emojionearea.scss";
</style>

