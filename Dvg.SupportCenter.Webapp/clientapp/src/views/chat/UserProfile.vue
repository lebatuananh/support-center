<template>
  <div id="parentx-demo-2" v-if="profile">
    <vs-sidebar parent="#chat-app"
                :position-right="!isActiveUser"
                :hidden-background="false"
                v-model="activeLocal"
                id="chat-profile-sidebar"
                class="items-no-padding">
      <div class="header-sidebar relative flex flex-col p-0" slot="header">
        <feather-icon icon="XIcon"
                      svgClasses="m-2 cursor-pointer absolute top-0 right-0"
                      @click="$emit('closeProfileSidebar', false)"></feather-icon>

        <div class="relative inline-flex mx-auto mb-5 mt-6">
          <vs-avatar class="m-0 border-white border-2 border-solid shadow-md"
                     :src="profile.avatarUrl"
                     size="70px" />
          <div class="h-5 w-5 border-white border-2 border-solid rounded-full absolute right-0 bottom-0"
               :class="'bg-' + statusColor"></div>
        </div>
        <h4 class="mr-2 self-center">{{ profile.name }}</h4>
      </div>

      <VuePerfectScrollbar class="scroll-area" :settings="settings">
        <div class="p-8">
          <h6 class="mb-2" :class="{'ml-4': isActiveUser}">Tên: {{profile.name}}</h6>
          <h6 class="mb-2" :class="{'ml-4': isActiveUser}">Số điện thoại: {{profile.phoneNumber}}</h6>
          <h6 class="mb-2" :class="{'ml-4': isActiveUser}">Email: {{profile.email}}</h6>
          <!--<vs-textarea class="mb-10"
                       counter="120"
                       maxlength="120"
                       :counter-danger.sync="counterDanger"
                       v-model="about"
                       rows="5"
                       v-if="isActiveUser" />-->
          <!--<p v-else>{{ about }}</p>-->

          <!--<div class="userProfile__status" v-if="isActiveUser">
            <h6 class="mb-4">Status</h6>
            <ul>
              <li class="mb-2">
                <vs-radio v-model="profile.status" vs-value="online" color="success">Active</vs-radio>
              </li>
              <li class="mb-2">
                <vs-radio v-model="profile.status"
                          vs-value="do not disturb"
                          color="danger">Do Not Disturb</vs-radio>
              </li>
              <li class="mb-2">
                <vs-radio v-model="profile.status" vs-value="away" color="warning">Away</vs-radio>
              </li>
              <li class="mb-2">
                <vs-radio v-model="profile.status" vs-value="offline" color="grey">Offline</vs-radio>
              </li>
            </ul>
          </div>-->
        </div>
      </VuePerfectScrollbar>
    </vs-sidebar>
  </div>
</template>

<script>
  import VuePerfectScrollbar from "vue-perfect-scrollbar";
  import { mapGetters } from "vuex";

  export default {
    props: {
      active: {
        type: Boolean,
        required: true
      }
    },
    created() {
      this.$store.subscribe((mutation, state) => {
        var activeContactUsername = state.chat.contactManager.activeContactUsername;
        if (!activeContactUsername)
          return;
        let contact = state.chat.contactManager.contacts.find(contact => contact.username == activeContactUsername);
        this.profile = contact;
      });
    },
    data() {
      let currentUser = this.$store.state.auth.currentUser;
      return {
        isActiveUser: false,
        currentUser: currentUser,
        contacts: [],
        counterDanger: false,
        settings: {
          // perfectscrollbar settings
          maxScrollbarLength: 60,
          wheelSpeed: 0.6
        },
        profile: null
      };
    },
    computed: {
      ...mapGetters({
        activeContact: "chat/activeContact",
        jid: "chat/jid"
      }),
      
      activeLocal: {
        get() {
          return this.active;
        },
        set(value) {
          this.$emit("closeProfileSidebar", value);
        }
      },
      about: {
        get() {
          this.profile.about;
        },
        set(value) {

        }
      },
      statusColor() {
        var userStatus = this.profile.status;

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
    methods: {},
    components: {
      VuePerfectScrollbar
    }
  };
</script>
