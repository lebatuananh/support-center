import apiClient from './apiClient'


const authenticationRepository = {
    async login(loginModel){
        try{
            var userModel = await apiClient.post("/api/authentication", loginModel)
            return userModel;
        }
        catch(exception){

        }
    
  },

  async getCurrentUser() {
    try {
      var userModel = await apiClient.get("/api/authentication")
      return userModel;
    }
    catch (exception) {
      console.log(exception);
      return null;
    }

  },

  async renewAccessToken() {
    try {
      var renewAccessTokenResult = await apiClient.get("/api/authentication/access_token")
      return renewAccessTokenResult;
    }
    catch (exception) {
      console.log(exception);
      return null;
    }
  },

  async logout() {
    try {
      await apiClient.post("/api/authentication/logout")
      return;
    }
    catch (exception) {
      console.log(exception);
      return;
    }

  }
}

export default authenticationRepository;
