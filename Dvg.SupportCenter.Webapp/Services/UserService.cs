using Dvg.SupportCenter.Data;
using Dvg.SupportCenter.Data.Dto;
using Dvg.SupportCenter.Data.Repositories.Interfaces;
using Dvg.SupportCenter.Exceptions;
using Dvg.SupportCenter.Models.User;
using Dvg.SupportCenter.Services.Interfaces;
using Dvg.SupportCenter.WebApp.Static;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Dvg.SupportCenter.Services
{
    public class UserService : IUserService
    {
        private readonly IHttpContextAccessor contextAccessor;
        private readonly IUserRepository userRepository;
        private readonly IConfiguration configuration;

        public UserService(
            IHttpContextAccessor contextAccessor,
            IUserRepository userRepository,
            IConfiguration configuration
            )
        {
            this.contextAccessor = contextAccessor;
            this.userRepository = userRepository;
            this.configuration = configuration;
        }

        public async Task<UserModel> Login(LoginRequest chatUser)
        {
            try
            {
                var retrieveUserTokenRequest = new RetrieveUserAccessTokenRequest()
                {
                    Username = chatUser.Username,
                    Password = chatUser.Password
                };
                var userToken = await userRepository.RetrieveAccessTokenAsync(retrieveUserTokenRequest);

                var openfireUser = new UserModel()
                {
                    AccessToken = userToken.AccessToken,
                    AvatarUrl = userToken.AvatarUrl,
                    Email = userToken.Email,
                    Name = userToken.Name,
                    PhoneNumber = userToken.PhoneNumber,
                    Username = userToken.Username,
                    GroupIds = userToken.GroupIds,
                    RoomIds = userToken.RoomIds,
                    PartnerGroups = new UserPartnerGroupsModel()
                    {
                        BuyerGroupIds = userToken.PartnerGroups.BuyerGroupIds,
                        SellerGroupIds = userToken.PartnerGroups.SellerGroupIds,
                        SupporterGroupIds = userToken.PartnerGroups.SupporterGroupIds
                    }
                };
                contextAccessor.HttpContext.Session.Set<UserModel>("ChatUser", openfireUser);

                return openfireUser;
            }
            catch(OpenfireException exception)
            {
                if(exception.Detail.ErrorCode == OpenfireErrorCode.USER_NOT_EXIST)
                {
                    throw new UnauthorizedException("Tên đăng nhập hoặc mật khẩu không đúng");
                }
         
                throw new InternalServerErrorException("Không xác định được chat user");
            }
            catch(Exception e)
            {
                Console.WriteLine(e.Message);
                Console.WriteLine("Have exception", e.InnerException == null ? e.Message : e.InnerException.Message);
                throw new InternalServerErrorException(e.Message);
            }

        }
        public async Task<UserModel> GetCurrentUser()
        {
            var sessionUser = contextAccessor.HttpContext.Session.Get<UserModel>("ChatUser");
            if (sessionUser == null)
                throw new UnauthorizedAccessException("Chưa đăng nhập");
            return sessionUser;
        }

        public async Task<string> RenewAccessToken()
        {
            var sessionUser = contextAccessor.HttpContext.Session.Get<UserModel>("ChatUser");
            if (sessionUser == null)
                throw new UnauthorizedAccessException("Chưa đăng nhập");

            var userToken = await userRepository.RetrieveAccessTokenAsync(sessionUser.Username);

            sessionUser.AccessToken = userToken.AccessToken;
            contextAccessor.HttpContext.Session.Set<UserModel>("ChatUser", sessionUser);

            return userToken.AccessToken;
        }

        public void Logout()
        {
            contextAccessor.HttpContext.Session.Remove("ChatUser");
        }
    }

   

    public static class SessionExtensions
    {
        public static void Set<T>(this ISession session, string key, T value)
        {
            session.SetString(key, JsonConvert.SerializeObject(value));
        }

        public static T Get<T>(this ISession session, string key)
        {
            var value = session.GetString(key);

            return value == null ? default(T) :
                JsonConvert.DeserializeObject<T>(value);
        }
    }

    public static class ClaimsPrincipalExtensions
    {
        public static string GetSpecificClaim(this ClaimsPrincipal claimsPrincipal, string claimType)
        {
            var claim = claimsPrincipal.Claims.FirstOrDefault(x => x.Type == claimType);
            return claim != null ? claim.Value : string.Empty;
        }
    }
}
