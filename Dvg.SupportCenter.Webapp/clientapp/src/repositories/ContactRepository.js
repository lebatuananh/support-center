import apiClient from './openfireApiClient'

const contactRepository = {
    async getRecentContacts(params){
        try{
            console.log(params)
            var contacts = await apiClient.get("conversations", {params: params})
            return contacts;
        }
        catch(exception){
            console.log(exception);
        }
    },
    async getUser(username){
        try{
            var contact = await apiClient.get(`users/${username}`, null)
            return contact;
        }
        catch(exception){
            console.log(exception);
        }
    }
}
export default contactRepository;