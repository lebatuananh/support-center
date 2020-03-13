using System;
using System.Collections.Generic;
using System.Text;

namespace Dvg.SupportCenter.Data.Dto
{
    public class ErrorResponse
    {
        public int ErrorCode { get; set; }
        public int StatusCode { get; set; }
        public List<string> Messages { get; set; }
    }
}
