using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Dvg.SupportCenter.WebApp.Configurations
{
    public class AppSettings
    {
        private static IConfiguration config;

        public static void SetConfig(IConfiguration configuration)
        {
            config = configuration;
        }

        public static T Get<T>(string key = null, T defaultValue = default)
        {
            if (string.IsNullOrWhiteSpace(key))
                return config.Get<T>();
            var test = config.GetSection(key).Get<T>();
            return config.GetSection(key).Get<T>();
        }

        public static T Get<T>(string key = null)
        {
            if (string.IsNullOrWhiteSpace(key))
                return config.Get<T>();
            var test = config.GetSection(key).Get<T>();
            return config.GetSection(key).Get<T>();
        }
    }
}
