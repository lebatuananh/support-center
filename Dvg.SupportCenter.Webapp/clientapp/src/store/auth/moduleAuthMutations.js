/*=========================================================================================
  File Name: moduleAuthMutations.js
  Description: Auth Module Mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


export default {
	UPDATE_AUTHENTICATED_USER(state, user) {
    state.currentUser = user;
  },
  updateAccessToken(state, accessToken) {
    if (!state.currentUser)
      return;
    state.currentUser.accessToken = accessToken;
  },
  clearUserData(state) {
    state.currentUser = null;
  }
}
