import axios from 'axios';

const apiClient = {
  async get(url, requestOptions) {
    let options = this.setRequestOptions(requestOptions);
    try {
      let response = await axios.get(url, options);
      return this.processRequestResponse(response);
    }
    catch (exception) {
      return Promise.reject(exception);
    }
  },
  async post(url, data, requestOptions = null) {
    let options = this.setRequestOptions(requestOptions);
    try {
      let response = await axios.post(url, data, options);
      return this.processRequestResponse(response);
    }
    catch (exception) {
      return Promise.reject(exception);
    }
  },
  setRequestOptions(requestOptions) {
    if (!requestOptions || requestOptions == null)
      requestOptions = {};
    requestOptions.withCredentials = true
  },
    processRequestResponse(response) {
        var data = response.data;
        if (data.statusCode) {
            if (data.statusCode == 401) {
                let accountItem = localStorage.getItem('account');
                if (accountItem != undefined && accountItem != null) {
                    localStorage.removeItem('account')
                }
                if (!window.location.href.includes('pages/login'))
                    //router.push({ path: '/admin/accounts/login' })
                    window.location.href = "pages/login";
                    
                else
                    return Promise.reject(data);
            }
            else if (data.statusCode > 300)
                return Promise.reject(data);
        }
            
        return Promise.resolve(data);
    }
}
export default apiClient;
