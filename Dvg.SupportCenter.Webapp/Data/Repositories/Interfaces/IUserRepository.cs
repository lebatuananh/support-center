using Dvg.SupportCenter.Data.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Dvg.SupportCenter.Data.Repositories.Interfaces
{
    public interface IUserRepository : IRepository
    {
        Task<CreateUserResponse> CreateUserAsync(CreateUserRequest restRequest);
        Task<RetrieveAccessTokenResponse> RetrieveAccessTokenAsync(RetrieveUserAccessTokenRequest model);
        Task<RetrieveAccessTokenResponse> RetrieveAccessTokenAsync(string username);
    }
}
