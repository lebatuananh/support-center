using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Dvg.SupportCenter.Data
{
    public abstract class CustomHttpClient : HttpClient
    {
        public abstract T Deserialize<T>(string json);
        public abstract string Serialize(object obj);

        public virtual async Task PreprocessResponse(HttpResponseMessage responseMessage)
        {
            if (!responseMessage.IsSuccessStatusCode)
            {
                var bodyText = await responseMessage.Content.ReadAsStringAsync().ConfigureAwait(false);
                throw new Exception(bodyText);
            }
        }

        public virtual HttpRequestMessage InitRequest(HttpMethod method, string path,
            Dictionary<string, string> queries)
        {
            var requestUri = path;
            if (queries != null)
            {
                var listQuery = queries.Where(pair => pair.Value != null)
                    .Select(s => string.Format("{0}={1}", s.Key, s.Value));
                var queryString = string.Join("&", listQuery);
                requestUri = string.Format("{0}?{1}", requestUri, queryString);
            }

            var request = new HttpRequestMessage(method, requestUri);

            return request;
        }

        public virtual void SetRequestBody(HttpRequestMessage requestMessage, object obj)
        {
            if (obj != null)
                requestMessage.Content = new StringContent(Serialize(obj), Encoding.UTF8, "application/json");
        }

        public async Task<T> GetAsync<T>(string path, Dictionary<string, string> queries = null)
        {
            var requestMessage = InitRequest(HttpMethod.Get, path, queries);
            var responseMessage = await SendAsync(requestMessage).ConfigureAwait(false);
            await PreprocessResponse(responseMessage).ConfigureAwait(false);
            var bodyText = await responseMessage.Content.ReadAsStringAsync().ConfigureAwait(false);
            return Deserialize<T>(bodyText);
        }

        public async Task<T> PostAsync<T>(string path, object obj, Dictionary<string, string> queries = null)
        {
            try
            {
                var requestMessage = InitRequest(HttpMethod.Post, path, queries);
                SetRequestBody(requestMessage, obj);
                var responseMessage = await SendAsync(requestMessage).ConfigureAwait(false);
                await PreprocessResponse(responseMessage).ConfigureAwait(false);
                var bodyText = await responseMessage.Content.ReadAsStringAsync().ConfigureAwait(false);
                return Deserialize<T>(bodyText);
            }
            catch(Exception e)
            {
                throw;
            }
            
        }

        public async Task<T> PutAsync<T>(string path, object obj, Dictionary<string, string> queries = null)
        {
            var requestMessage = InitRequest(HttpMethod.Put, path, queries);
            SetRequestBody(requestMessage, obj);
            var responseMessage = await SendAsync(requestMessage).ConfigureAwait(false);
            await PreprocessResponse(responseMessage).ConfigureAwait(false);
            var bodyText = await responseMessage.Content.ReadAsStringAsync().ConfigureAwait(false);
            return Deserialize<T>(bodyText);
        }

        public async Task<T> DeleteAsync<T>(string path, object obj, Dictionary<string, string> queries = null)
        {
            var requestMessage = InitRequest(HttpMethod.Delete, path, queries);
            SetRequestBody(requestMessage, obj);
            var responseMessage = await SendAsync(requestMessage).ConfigureAwait(false);
            await PreprocessResponse(responseMessage).ConfigureAwait(false);
            var bodyText = await responseMessage.Content.ReadAsStringAsync().ConfigureAwait(false);
            return Deserialize<T>(bodyText);
        }
    }
}
