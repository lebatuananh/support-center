using Dvg.SupportCenter.Models.User;
using Dvg.SupportCenter.Services.Interfaces;
using Dvg.SupportCenter.Webapp.Models.User;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Dvg.SupportCenter.WebApp.Controllers
{
    [ApiController]
    [Route("/api/authentication")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IUserService userService;

        public AuthenticationController(
            IUserService userService
            )
        {
            this.userService = userService;
        }

        [HttpPost]
        public async Task<UserModel> Login([FromBody] LoginRequest model)
        {
            var user = await userService.Login(model);
            return user;
        }

        [HttpGet]
        public async Task<UserModel> GetCurrentUser()
        {
            var user = await userService.GetCurrentUser();
            return user;
        }

        [HttpGet]
        [Route("access_token")]
        public async Task<RenewAccessTokenResultModel> RenewAccessToken()
        {
            var accessToken = await userService.RenewAccessToken();
            var result = new RenewAccessTokenResultModel()
            {
                AccessToken = accessToken
            };
            return result;
        }

        [HttpPost]
        [Route("logout")]
        public void Logout()
        {
            userService.Logout();
        }
    }
}
