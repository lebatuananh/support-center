using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Dvg.SupportCenter.Configurations
{
    public class OpenfireApiConfiguration
    {
        public string BaseUrl { get; set; }
        public string PathPrefix { get; set; }
        public int TimoutInMilliseconds { get; set; }
    }
    public class OpenfireUserConfiguration
    {
        public string DefaultAvatarUrl { get; set; }
    }
    public class OpenfireChatConfiguration
    {
        public string Domain { get; set; }
        public string BoshService { get; set; }
        public string ChatRoomService { get; set; }
    }
    public class OpenfireApplicationConfiguration
    {
        public string SecretKey { get; set; }
        public string Name { get; set; }
        public int Id { get; set; }
        public string AccessToken { get; set; }
    }
}
