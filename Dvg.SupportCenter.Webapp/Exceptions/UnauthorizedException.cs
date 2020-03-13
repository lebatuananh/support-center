using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Dvg.SupportCenter.Exceptions
{
    public class UnauthorizedException : BaseCustomException
    {
        public UnauthorizedException(string message) : base(new List<string>() { message }, HttpStatusCode.Unauthorized)
        {
        }
    }
}
