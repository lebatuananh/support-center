using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Dvg.SupportCenter.Exceptions
{
    public class NotFoundException : BaseCustomException
    {
        public NotFoundException(string message = "Cannot find object") : base(new List<string> { message },
            HttpStatusCode.NotFound)
        {
        }
    }
}
