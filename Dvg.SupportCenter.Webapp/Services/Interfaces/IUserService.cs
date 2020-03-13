using Dvg.SupportCenter.Models.User;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Dvg.SupportCenter.Services.Interfaces
{
    public interface IUserService
    {
        Task<UserModel> Login(LoginRequest chatUser);
        Task<UserModel> GetCurrentUser();
        void Logout();
        Task<string> RenewAccessToken();
    }
}
