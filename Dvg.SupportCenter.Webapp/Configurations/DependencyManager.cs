using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Dvg.SupportCenter.Configurations
{
    public class DependencyManager
    {
        public static IServiceProvider ServiceProvider { get; set; }

        public static void SetServiceProvider(IServiceProvider serviceProviderInstance)
        {
            ServiceProvider = serviceProviderInstance;
        }
    }
}
