import axios from 'axios';
import settings from '../statics/settings'

const baseUrl = settings.baseOpenfireApiUrl;

const openfireApiClient = {
  async get(path, requestOptions) {
    var url = this.setUrl(path);
    let options = this.setRequestOptions(requestOptions);
    try {
      let response = await axios.get(url, options);
      return this.processRequestResponse(response);
    }
    catch (exception) {
      return Promise.reject(exception);
    }
  },
  async post(path, data, requestOptions = null) {
    var url = this.setUrl(path);
    let options = this.setRequestOptions(requestOptions);
    try {
      let response = await axios.post(url, data, options);
      return this.processRequestResponse(response);
    }
    catch (exception) {
      return Promise.reject(exception);
    }
  },
  async put(path, data, requestOptions = null) {
    var url = this.setUrl(path);
    let options = this.setRequestOptions(requestOptions);
    try {
      let response = await axios.put(url, data, options);
      return this.processRequestResponse(response);
    }
    catch (exception) {
      return Promise.reject(exception);
    }
  },
  setUrl(path) {
    return baseUrl + path;
  },
  setRequestOptions(requestOptions) {
    if (!requestOptions || requestOptions == null)
      requestOptions = {};
    this.setToken();
    if (requestOptions.headers && requestOptions.headers != null) {
      requestOptions.headers['Authorization'] = 'Bearer ' + this.token;
    }
    else {
      requestOptions.headers = { 'Authorization': 'Bearer ' + this.token };
    }
    return requestOptions;
  },
  setToken() {
    let currentUser = vueInstance.$store.state.auth.currentUser;
    if (currentUser) {
      this.token = currentUser.accessToken;
    }

    if (this.token == null)
      this.token = '';
  },
  processRequestResponse(response) {
    var data = response.data;
    if (data.statusCode) {
      if (data.statusCode == 401) {
        let accountItem = localStorage.getItem('account');
        if (accountItem != undefined && accountItem != null) {
          localStorage.removeItem('account')
        }
        if (!window.location.href.includes('admin/accounts/login'))
          //router.push({ path: '/admin/accounts/login' })
          window.location.href = "/admin/accounts/login";

        else
          return Promise.reject(data);
      }
      else if (data.statusCode > 300)
        return Promise.reject(data);
    }

    return Promise.resolve(data);
  }
}
export default openfireApiClient;
