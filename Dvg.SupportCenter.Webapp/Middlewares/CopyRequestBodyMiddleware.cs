using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Hinox.Mvc.Middlewares
{
    public class CopyRequestBodyMiddleware : BaseCustomMiddleware
    {
        public CopyRequestBodyMiddleware(RequestDelegate next) : base(next)
        {
        }

        public override async Task InvokeAsync(HttpContext context)
        {
            var request = context.Request;

            if (request.Method == HttpMethods.Get)
                await next(context);
            else
                using (var bodyCopierStream = new MemoryStream())
                {
                    await request.Body.CopyToAsync(bodyCopierStream);

                    bodyCopierStream.Position = 0;

                    var streamReader = new StreamReader(bodyCopierStream);
                    var bodyText = await streamReader.ReadToEndAsync();
                    context.Items.Add("BodyText", bodyText);

                    bodyCopierStream.Position = 0;
                    request.Body = bodyCopierStream;
                    await next(context);
                }
        }
    }
}