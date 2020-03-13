using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Dvg.SupportCenter.Exceptions;
using Dvg.SupportCenter.WebApp.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace Hinox.Mvc.Middlewares
{
    public class ProcessExceptionMiddleware : BaseCustomMiddleware
    {
        private readonly IHostingEnvironment env;

        public ProcessExceptionMiddleware(RequestDelegate next, IHostingEnvironment env) : base(next)
        {
            this.env = env;
        }

        public override async Task InvokeAsync(HttpContext context)
        {
            ErrorModel error = null;
            try
            {
                await next(context);
            }
            catch (BaseCustomException e)
            {
                error = new ErrorModel(e.StatusCode, e.Messages);
                if (e.AdditionalData != null)
                    error.AdditionalData = e.AdditionalData;
            }
            catch (Exception e)
            {
                error = new ErrorModel
                {
                    StatusCode = (int) GetHttpStatusCode(e),
                    Messages = new List<string> {e.Message}
                };
                if (env.IsDevelopment()) Console.WriteLine(e);
            }

            if (error != null)
                await WriteExceptionResponse(context, error);
        }

        private HttpStatusCode GetHttpStatusCode(Exception exception)
        {
            var exceptionType = exception.GetType();
            if (exceptionType.Equals(typeof(NotFoundException)))
                return HttpStatusCode.NotFound;
            return HttpStatusCode.InternalServerError;
        }
    }
}