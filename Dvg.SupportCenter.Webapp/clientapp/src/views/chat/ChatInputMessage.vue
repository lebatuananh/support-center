<template>
  <div class="chat__input flex p-4 bg-white">
    <div class="vs-component vs-con-input-label vs-input flex-1 vs-input-primary">
      <div class="vs-con-input message-editor">
        <textarea
          id="input-message"
          type="text"
          class="vs-inputx vs-input--input normal"
          style="border: 1px solid rgba(0, 0, 0, 0.2);"
          placeholder="Type Your Message"
          :value="typedMessage()"
        />
        <div class="editor-tools-group">
          <!--<input type="file" class="tool-attach-file-hidden"/>
          <i class="icon-attach tool-attach-file"></i>
          <i class="material-icons">attach_file</i>-->
        </div>
      </div>
      <!-- <span></span> -->
    </div>
    <vs-button class="bg-primary-gradient ml-4" type="filled" @click="sendMessage()">Send</vs-button>
  </div>
</template>
<script>
export default {
  name: "input-message",
  mounted() {
    var that = this;
    $("#input-message").emojioneArea({
      pickerPosition: "top",
      filtersPosition: "bottom",
      tonesStyle: "square",
      shortnames: true,
      saveEmojisAs: "shortname",
      events: {
        keypress: function(editor, event) {
          if (event.keyCode == 13) {
            event.preventDefault();
            var elements = $("#input-message").emojioneArea();
            elements[0].emojioneArea.trigger('change');
            that.sendMessage();
          }
        },
        change: function(){
          $(".emojionearea-editor").children('.emojioneemoji').attr('alt', '');
          var htmlContent = $('.emojionearea-editor').html();
          that.$store.dispatch('chat/changeTypedMessage', htmlContent);
        }
      }
    });
  },
  computed:{
    
  },
  methods: {
    sendMessage() {
      console.log('send');
      this.$store.dispatch('chat/sendMessage');
      
    },
    typedMessage(){
      var result = this.$store.state.chat.conversationManager.activeConversation.typedMessage;
      $('.emojionearea-editor').html(result);
      //console.log(this.$store.state.chat.conversationManager.activeConversation)
      //console.log(result);
      return result;
    }
  }
};
</script>

<style>
.message-editor {
  flex-shrink: 0;
  display: flex !important;
  flex-direction: row !important;
}
.emojionearea {
  display: flex !important;
  align-items: center !important;
  width: -webkit-fill-available !important;
}

.emojionearea .emojionearea-editor {
  flex-grow: 1;
  padding: 0 !important;
  min-height: 3em !important;
  max-height: 6em !important;
  padding-left: 5px !important;
}

.emojionearea .emojionearea-editor::-webkit-scrollbar {
  width: 6px;
  background-color: #f5f5f5;
}

.emojionearea .emojionearea-editor::-webkit-scrollbar-corner {
}

.emojionearea .emojionearea-editor::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  background-color: rgba(0, 0, 0, 0);
}

.emojionearea .emojionearea-editor::-webkit-scrollbar-track-piece {
}

.emojionearea .emojionearea-editor::-webkit-scrollbar-button {
  display: none !important;
}

.emojionearea .emojionearea-editor::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: rgba(0, 0, 0, 0.1);
}

.emojionearea .emojionearea-button {
  position: initial !important;
  margin: 0 !important;
}

.message-editor .editor-tools-group {
  display: flex;
  justify-content: center;
  align-items: center;
}

.message-editor .editor-tools-group .tool-attach-file-hidden {
  display: none;
}

.message-editor .editor-tools-group .tool-attach-file {
  cursor: pointer;
}
</style>
