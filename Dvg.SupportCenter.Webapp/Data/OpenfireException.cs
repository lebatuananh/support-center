using Dvg.SupportCenter.Data.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace Dvg.SupportCenter.Data
{
    public class OpenfireException : Exception
    {
        public int StatusCode { get; set; }
        public ErrorResponse Detail { get; set; }
    }
}
