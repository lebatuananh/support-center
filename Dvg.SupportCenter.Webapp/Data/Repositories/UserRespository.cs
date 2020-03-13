using Dvg.SupportCenter.Data.Dto;
using Dvg.SupportCenter.Data.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Dvg.SupportCenter.Data.Repositories
{
    public class UserRepository : BaseRepository, IUserRepository
    {
        public UserRepository(OpenfireHttpClient restClient) : base(restClient)
        {
        }

        public async Task<CreateUserResponse> CreateUserAsync(CreateUserRequest restRequest)
        {
            var path = $"/users";
            var createUserResponse = await restClient.PostAsync<CreateUserResponse>(path, restRequest);
            return createUserResponse;
        }

        public async Task<RetrieveAccessTokenResponse> RetrieveAccessTokenAsync(RetrieveUserAccessTokenRequest model)
        {
            var path = $"/users/login";
            var result = await restClient.PostAsync<RetrieveAccessTokenResponse>(path, model);
            return result;
        }

        public async Task<RetrieveAccessTokenResponse> RetrieveAccessTokenAsync(string username)
        {
            var path = $"/users/{username}/access_token";
            var result = await restClient.GetAsync<RetrieveAccessTokenResponse>(path);
            return result;
        }
    }
}
