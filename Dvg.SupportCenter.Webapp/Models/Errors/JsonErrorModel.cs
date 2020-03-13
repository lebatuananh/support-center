using System;
using System.Collections.Generic;
using System.Text;

namespace Dvg.SupportCenter.Models.Errors
{
    public class JsonErrorModel : BaseJsonResultData
    {
        public List<string> Messages { get; set; }

        public JsonErrorModel(List<string> messages)
        {
            this.Messages = messages;
        }
    }
}
