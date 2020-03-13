import router from '@/router'
import authenticationRepository from '../../repositories/AuthenticationRepository';

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

export default {
  async loadCurrentUser({ state, commit, dispatch }, payload) {
    if (state.isAuthenticated()) {
      return;
    }
    try {
      var userModel = await authenticationRepository.getCurrentUser();
      commit('UPDATE_AUTHENTICATED_USER', userModel);
      dispatch("intervalRenewAccessToken")
    }
    catch (exception) {

    }
  },
  async loginAttempt({ dispatch }, payload) {

    // New payload for login action
    const newPayload = {
      userDetails: payload.userDetails,
      notify: payload.notify
    }

    dispatch('login', newPayload);
  },
  async login({ commit, state, dispatch }, payload) {

    // If user is already logged in notify and exit
    if (state.isAuthenticated()) {
      payload.notify({
        title: 'Login Attempt',
        text: 'You are already logged in!',
        iconPack: 'feather',
        icon: 'icon-alert-circle',
        color: 'warning'
      });
      return false
    }

    try {
      let userModel = await authenticationRepository.login(payload.userDetails);
      commit('UPDATE_AUTHENTICATED_USER', userModel);
      router.push('/chat');
      
    }
    catch (exception) {
      payload.notify({
        time: 2500,
        title: 'Error',
        text: exception.message,
        iconPack: 'feather',
        icon: 'icon-alert-circle',
        color: 'danger'
      });
    }
  },
  logout({ commit, state }) {
    commit("clearUserData")
  },
  intervalRenewAccessToken({ commit, rootState, state }) {
    setInterval(async function () {
      console.log("INTERVAL CHECK USER ACCESS_TOKEN EXPIRED")
      var user = rootState.auth.currentUser;
      if (!user)
        return;
      let token = user.accessToken;
      if (!token)
        return;

      let jwtObject = parseJwt(token);
      let expiredTimeEpoch = jwtObject.exp; //expiredTime trong jwt đơn vị là giây
      let currentTime = (new Date().getTime()) / 1000; //thằng này đơn vị là milli giây nên phải chia 1000

      let alivedTimeInSeconds = expiredTimeEpoch - currentTime;
      console.log("ALIVED TIME IN SECONDS ", alivedTimeInSeconds)

      if (alivedTimeInSeconds >= 300)
        return;
      //do renew jwt
      try {
        let newAccessTokenResult = await authenticationRepository.renewAccessToken();
        console.log("NEW ACCESS TOKEN: ", newAccessTokenResult.accessToken);
        commit("updateAccessToken", newAccessTokenResult.accessToken)
      }
      catch (exception) {
        console.log(exception);
      }

    }, 30000)
  }
}
