using Dvg.SupportCenter.Data.Dto;
using Dvg.SupportCenter.WebApp.Static;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

namespace Dvg.SupportCenter.Data
{
    public class OpenfireHttpClient : CustomHttpClient
    {
        private string accessToken;
        private string pathPrefix;
        public OpenfireHttpClient(IConfiguration configuration)
        {
            BaseAddress = new Uri(StaticVariables.OpenfireApiConfiguration.BaseUrl);
            accessToken = StaticVariables.OpenfireApplicationConfiguration.AccessToken;
            pathPrefix = StaticVariables.OpenfireApiConfiguration.PathPrefix;
            Timeout = TimeSpan.FromMilliseconds(StaticVariables.OpenfireApiConfiguration.TimoutInMilliseconds);
            ServicePointManager.ServerCertificateValidationCallback =
                delegate (object sender, X509Certificate certificate, X509Chain chain, SslPolicyErrors sslPolicyErrors)
                    {
                        return true;
                    };
            //DefaultRequestHeaders.Add("Content-Type", "application/json; charset=utf-8");
        }

        public static readonly JsonSerializerSettings JsonSettings = new JsonSerializerSettings
        {
            ContractResolver = new DefaultContractResolver
            {
                NamingStrategy = new CamelCaseNamingStrategy()
            }
        };
        public override string Serialize(object obj)
        {
            return JsonConvert.SerializeObject(obj, JsonSettings);
        }

        public override T Deserialize<T>(string json)
        {
            return JsonConvert.DeserializeObject<T>(json, JsonSettings);
        }
        public override HttpRequestMessage InitRequest(HttpMethod method, string path,
            Dictionary<string, string> queries)
        {
            var realPath = pathPrefix + path;
            var requestMessage = base.InitRequest(method, realPath, queries);
            requestMessage.Headers.Authorization = new AuthenticationHeaderValue(
                "Bearer",
                accessToken
                );
            return requestMessage;
        }
        public override async Task PreprocessResponse(HttpResponseMessage responseMessage)
        {
            Console.WriteLine($"{responseMessage.RequestMessage.Method.ToString()}: {responseMessage.RequestMessage.RequestUri.ToString()}");
            if (!responseMessage.IsSuccessStatusCode)
            {
                var bodyText = await responseMessage.Content.ReadAsStringAsync().ConfigureAwait(false);
                Console.WriteLine(bodyText);
               var errorDetail = Deserialize<ErrorResponse>(bodyText);

                var exception = new OpenfireException()
                {
                    StatusCode = (int)responseMessage.StatusCode,
                    Detail = errorDetail
                };
                throw exception;
            }
        }
    }
}
