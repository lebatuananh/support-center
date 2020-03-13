using System;
using System.Collections.Generic;
using System.Text;

namespace Dvg.SupportCenter.Data.Dto
{
    public class RetrieveAccessTokenResponse
    {
        public string Username { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string AvatarUrl { get; set; }
        public string AccessToken { get; set; }
        public List<string> GroupIds { get; set; }
        public UserPartnerGroups PartnerGroups { get; set; }
        public List<string> RoomIds { get; set; }
    }
    public class UserPartnerGroups
    {
        public List<string> SupporterGroupIds { get; set; }
        public List<string> SellerGroupIds { get; set; }
        public List<string> BuyerGroupIds { get; set; }
    }
}
