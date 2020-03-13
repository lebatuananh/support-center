using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Dvg.SupportCenter.WebApp.Models
{
    public class ErrorModel
    {
        public ErrorModel(HttpStatusCode statusCode, List<string> messages)
        {
            StatusCode = (int)statusCode;
            Messages = messages;
        }

        public ErrorModel()
        {
        }

        public int StatusCode { get; set; }
        public List<string> Messages { get; set; }
        public object AdditionalData { get; set; }
    }
}
