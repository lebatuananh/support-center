<!-- =========================================================================================
    File Name: ChatContact.vue
    Description: Chat contact - single component for chat
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div class="chat__contact flex items-center px-2 py-3" :class="{'bg-primary-gradient text-white shadow-lg': active}">
    <div class="contact__avatar mr-3 relative flex mr-4">
      <vs-avatar class="border-2 border-solid border-white" :src="contact.avatarUrl" size="42px"></vs-avatar>
      <div class="h-3 w-3 border-white border border-solid rounded-full absolute contact-status-color"
           :class="'bg-' + statusColor"></div>
    </div>
    <div class="contact__container w-full flex items-center justify-between overflow-hidden">
      <div class="contact__info flex flex-col truncate w-5/6">
        <h5 class="font-semibold" :class="{'text-white': active}">{{ contact.name }}</h5>
        <span class="truncate">{{ contact.about }}</span>
      </div>

      <div class="chat__contact__meta flex self-start flex-col items-end w-1/6">
        <span class="whitespace-no-wrap font-semibold" v-if="unseenMsg">{{contact.unreadMessageCount}}</span>
        <!--<vs-avatar color="primary" :text="`${unseenMsg}`" size="20px" v-if="unseenMsg" />-->
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'chat-contact',
    props: {
      contact: {
        type: Object,
        required: true,
      }
    },
    created() {
      //console.log(this.contact)
    },
    computed: {
      active() {
        var activeContactUsername = this.$store.state.chat.contactManager.activeContactUsername;
        //console.log(activeContactUsername);
        return this.contact.username == activeContactUsername;
      },
      unseenMsg() {
        return this.contact.unreadMessageCount > 0;
      },
      statusColor() {
        console.log(this.contact.status)
        if (!this.contact)
          return "grey";
        const userStatus = this.contact.status;

        if (userStatus == "online") {
          return "success";
        } else if (userStatus == "do not disturb") {
          return "danger";
        } else if (userStatus == "away") {
          return "warning";
        } else {
          return "grey";
        }
      }

    }
  }
</script>

<style scoped lang="scss">
  .contact-status-color{
    right: 4px !important;
    bottom: 4px !important;

  }
</style>
