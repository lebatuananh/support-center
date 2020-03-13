using System;
using System.Collections.Generic;
using System.Net;
using System.Text;

namespace Dvg.SupportCenter.Models
{
    public class JsonResultModel
    {
        public int Code { get; set; }
        public BaseJsonResultData Data { get; set; }

        public JsonResultModel(BaseJsonResultData data)
        {
            this.Code = (int) HttpStatusCode.OK;
            this.Data = data;
        }
        public JsonResultModel(int code, BaseJsonResultData data)
        {
            this.Code = code;
            this.Data = data;
        }
    }
}
