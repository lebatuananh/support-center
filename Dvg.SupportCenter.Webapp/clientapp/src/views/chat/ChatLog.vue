<!-- hasSentPreviousMsg -->
<template>
  <div id="component-chat-log" v-if="conversation">
    <div v-for="(msg, index) in messages" class="msg-grp-container" :key="msg.time">
      <div ref="firstUnreadMessage" v-if="isFirstUnreadMessage(index)" class="firstUnreadMessage" :message-time="msg.time">
      </div>
      <!-- If previouse msg is older than current time -->
      <template v-if="messages[index-1]">
        <vs-divider v-if="!isSameDay(msg.time, messages[index-1].time)">
          <span>{{ toDate(msg.time) }}</span>
        </vs-divider>
        <div class="spacer mt-8"
             v-if="!hasSentPreviousMsg(messages[index-1].isSent, msg.isSent)"></div>
      </template>

      <div class="flex items-start" :class="[{'flex-row-reverse' : msg.isSent}]">
        <template v-if="messages[index-1]">
          <template v-if="(!hasSentPreviousMsg(messages[index-1].isSent, msg.isSent) || !isSameDay(msg.time, messages[index-1].time))">
            <vs-avatar size="40px"
                       class="m-0 flex-shrink-0"
                       :class="msg.isSent ? 'sm:ml-5 ml-3' : 'sm:mr-5 mr-3'"
                       :src="contact.img"></vs-avatar>
          </template>
        </template>

        <template v-if="index == 0">
          <vs-avatar size="40px"
                     class="m-0 flex-shrink-0"
                     :class="msg.isSent ? 'sm:ml-5 ml-3' : 'sm:mr-5 mr-3'"
                     :src="contact.img"></vs-avatar>
        </template>

        <template v-if="messages[index-1]">
          <div class="mr-16"
               v-if="!(!hasSentPreviousMsg(messages[index-1].isSent, msg.isSent) || !isSameDay(msg.time, messages[index-1].time))"></div>
        </template>

        <div class="msg break-words relative shadow-md rounded py-3 px-4 mb-2 rounded-lg max-w-sm"
             :class="{'bg-primary-gradient text-white': msg.isSent, 'border border-solid border-grey-light bg-white': !msg.isSent}">
          <span v-html="msg.content"></span>
        </div>
      </div>


    </div>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  import cloneDeep from "lodash/cloneDeep";

  export default {
    name: "chat-log",
    data() {
      return {
        messages: [],
        contact: null,
        conversation: null
      }
    },
    created() {
      this.$store.dispatch('chat/doUpdateReadMessageTime')

      this.$store.subscribe((mutation, state) => {
        var activeContactUsername = state.chat.contactManager.activeContactUsername;
        if (!activeContactUsername)
          return;
        this.contact = state.chat.contactManager.contacts.find(contact => contact.username == activeContactUsername);
        this.conversation = state.chat.conversationManager.conversations[activeContactUsername];
        this.messages = state.chat.conversationManager.conversations[activeContactUsername].messages;       
      });

      this.$store.subscribeAction((action, state) => {
        if (this.contact == null)
          return;
        if (action.type !== "chat/sendMessage")
          return;
        if (state.chat.contactManager.activeContactUsername != this.contact.username)
          return;
        this.scrollToBottom();
      })
    },
    computed: {
      hasSentPreviousMsg() {
        return (last_sender, current_sender) => last_sender == current_sender;
      },     
    },
    methods: {
      readTo(clientHeight) {
        var unreadElements = this.$refs.firstUnreadMessage;
        if (!unreadElements)
          return;
        for (let i = 0; i < unreadElements.length; i++) {
          let unreadElement = unreadElements[i];

          var heightToRead = unreadElement.offsetTop + unreadElement.clientHeight;
          if (heightToRead <= clientHeight) {
            let parent = unreadElement.parentElement;
            let spanElement = parent.getElementsByTagName('span')[0];
            //console.log("read ", spanElement.innerText)
            var time = unreadElement.getAttribute('message-time');            
            this.$store.dispatch('chat/readMessage', time);
          }
        }
      },
      isFirstUnreadMessage(index) {
        var messages = this.messages;
        var message = messages[index];

        if (this.messages.length <= 2)
          return false;

        for (let i = index + 1; i < messages.length; i++) {
          var nextMessage = messages[i];
          var isSeen = this.isSeen(i);
          if (isSeen) {
            return false;
          }
        }
        return true;
      },
      isSeen(messageIndex) {
        var messages = this.messages;
        var nextMessage = messages[messageIndex];
        if (nextMessage.isSent) {
          return true;
        }
        if (nextMessage.isSeen) {
          return true;
        }
        return false;
      },
      isSameDay(time_to, time_from) {
        const date_time_to = new Date(time_to);
        const date_time_from = new Date(time_from);
        return (
          date_time_to.getFullYear() === date_time_from.getFullYear() &&
          date_time_to.getMonth() === date_time_from.getMonth() &&
          date_time_to.getDate() === date_time_from.getDate()
        );
      },
      toDate(time) {
        const locale = "en-us";
        const date_obj = new Date(time);
        const monthName = date_obj.toLocaleString(locale, {
          month: "short"
        });
        return date_obj.getDate() + " " + monthName;
      },
      scrollToBottom() {
        console.log("scroll to bottom".toUpperCase());
        console.log(this.$parent.$el);
        this.$nextTick(() => {
          this.$parent.$el.scrollTop = this.$parent.$el.scrollHeight;
        });
      },
      scrollToFirstUnreadMessage() {
        var dom = this.$refs.firstUnreadMessage;

        if (!dom) {
          this.scrollToBottom();
          return;
        }
          

        if (dom && dom.length == 0) {
          this.scrollToBottom();
          return;
        }

        var element = dom[0].parentElement;
        var offsetTop = element.offsetTop + element.clientHeight;
        var clientHeight = this.$parent.$el.clientHeight;

        if (offsetTop < clientHeight) {
          return;
        }

        this.$parent.$el.scrollTop = offsetTop - clientHeight;
      },
      onScroll() {
        console.log("scroll")
      }
    },
    updated() {
      // this.scrollToBottom();
      this.scrollToFirstUnreadMessage();
    },
    mounted() {
      // this.scrollToBottom();
      this.scrollToFirstUnreadMessage();

      this.$store.subscribe((mutation, state) => {
        console.log("MUTATION: ", mutation);
        if (mutation.type == "chat/addMessage") {
          var scrollHeight = this.$parent.$el.scrollHeight;
          var scrollTop = this.$parent.$el.scrollTop;
          var clientHeight = this.$parent.$el.clientHeight;
          if (scrollHeight - scrollTop - clientHeight <= 20) {
            this.scrollToBottom();
          }
        }
      });
    }
  };
</script>
