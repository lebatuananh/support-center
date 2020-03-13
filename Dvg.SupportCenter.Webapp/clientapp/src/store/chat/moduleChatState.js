/*=========================================================================================
  File Name: moduleChatState.js
  Description: Chat Module State
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


export default {
    jid:{
      id: '',
      resource: '',
      jid: ''
    },
    chatSearchQuery: '',
    activeConversation: null,
    contactManager:{
      activeContactUsername: null,
      time: (new Date()).getTime(),
      contacts:[]
    },
    conversationManager:{
      conversations:{},
      activeConversation: {}
    }
}
