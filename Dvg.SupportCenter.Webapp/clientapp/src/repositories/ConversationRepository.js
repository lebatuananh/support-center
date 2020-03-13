import apiClient from './openfireApiClient';

export default {
  async getMessageHistory(partnerUsername, params){
        try{
          var messageHistoryResult = await apiClient.get(`conversations/${partnerUsername}/messages`, {params: params})
            return messageHistoryResult.messages;
        }
        catch(exception){
            console.log(exception);
        }
  },
  async updateReadTime(contactUsername, time) {
    try {
      await apiClient.put(`conversations/${contactUsername}/read_time`, { lastSeenAt: time })
      return;
    }
    catch (exception) {
      console.log(exception);
    }
  },
  async getUnreadMessageCount() {
    try {
      var unreadMessageCountResult = await apiClient.get(`conversations/messages/unread_count`)
      return unreadMessageCountResult;
    }
    catch (exception) {
      console.log(exception);
    }
  }
  
}
