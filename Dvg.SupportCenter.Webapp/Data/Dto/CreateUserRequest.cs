using System;
using System.Collections.Generic;
using System.Text;

namespace Dvg.SupportCenter.Data.Dto
{
    public class CreateUserRequest
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string AvatarUrl { get; set; }
        public string GroupName { get; set; }
        public bool ExternalRegistered { get; set; }
        public string ExternalUserId { get; set; }
        public string ExternalUserName { get; set; }
    }
}
