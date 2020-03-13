using Dvg.SupportCenter.Data;
using Dvg.SupportCenter.Data.Repositories;
using Dvg.SupportCenter.Data.Repositories.Interfaces;
using Dvg.SupportCenter.Services;
using Dvg.SupportCenter.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Dvg.SupportCenter.WebApp.Registrations
{
    public class DependencyRegistration
    {
        public static void Register(IServiceCollection services)
        {
            services.AddHttpContextAccessor();

            services.AddSingleton<OpenfireHttpClient>();
            services.AddSingleton<IUserRepository, UserRepository>();
            services.AddTransient<IUserService, UserService>();
        }
    }
}
