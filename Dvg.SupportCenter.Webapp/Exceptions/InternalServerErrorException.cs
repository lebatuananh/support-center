using System;
using System.Collections.Generic;
using System.Net;
using System.Text;

namespace Dvg.SupportCenter.Exceptions
{
    public class InternalServerErrorException : BaseCustomException
    {
        public InternalServerErrorException(string message) : base(new List<string>() { message }, HttpStatusCode.InternalServerError)
        {
        }
    }
}
