<!-- =========================================================================================
    File Name: ChatNavbar.vue
    Description: Chat Application - Chat navbar
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div v-if="contact" class="chat__header">
    <vs-navbar class="p-4 flex navbar-custom" color="white" type="flat">
      <div class="relative flex mr-4">
        <feather-icon
          icon="MenuIcon"
          class="mr-4 cursor-pointer"
         
          @click.stop="$emit('openContactsSidebar')"
        ></feather-icon>
        <vs-avatar
          class="m-0 border-2 border-solid border-white"
          size="40px"
          :src="contact.img"
          @click.stop="$emit('openContactsSidebar')"
        />
        <div
          class="h-3 w-3 border-white border border-solid rounded-full absolute right-0 bottom-0"
          :class="'bg-' + statusColor"
        ></div>
      </div>
      <h6>{{ contact.name }}</h6>
      <vs-spacer></vs-spacer>
      <!--<feather-icon
        icon="StarIcon"
        class="cursor-pointer"
        :svgClasses="[{'text-warning stroke-current': isPinnedLocal}, 'w-6', 'h-6']"
        @click.stop="toggleIsPinned"
      >

      </feather-icon>-->
    </vs-navbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    isPinnedProp: {
      type: Boolean,
      required: true
    },
    isSidebarCollapsed: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      // contacts: this.$store.state.chat.chatcontacts,
      isPinnedLocal: this.isPinnedProp
    };
  },
  watch: {
    isPinnedProp(val) {
      this.isPinnedLocal = val;
    }
  },
  computed: {
    ...mapGetters({
      contact: "chat/activeContact"
    }),
    statusColor() {
      if (!this.contact) return "grey";
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
  },
  methods: {
    toggleIsPinned() {
      const chatData = this.$store.getters["chat/chatDataOfUser"](this.userId);
      if (chatData) {
        const payload = { id: this.userId, value: !this.isPinnedLocal };
        this.$store.dispatch("chat/toggleIsPinned", payload);
      } else {
        this.$emit("toggleIsChatPinned", !this.isPinnedLocal);
      }
      this.isPinnedLocal = !this.isPinnedLocal;
    }
  }
};
</script>
