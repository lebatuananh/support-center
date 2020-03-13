using System;
using System.Collections.Generic;
using System.Text;

namespace Dvg.SupportCenter.Data.Dto
{
    public class RetrieveUserAccessTokenRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
