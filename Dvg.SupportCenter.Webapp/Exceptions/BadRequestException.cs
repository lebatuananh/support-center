using System;
using System.Collections.Generic;
using System.Net;
using System.Text;

namespace Dvg.SupportCenter.Exceptions
{
    public class BadRequestException : BaseCustomException
    {
        public BadRequestException(List<string> messages) : base(messages, HttpStatusCode.BadRequest)
        {
        }
        public BadRequestException(string message) : base(new List<string>() { message }, HttpStatusCode.BadRequest)
        {
        }
    }
}
