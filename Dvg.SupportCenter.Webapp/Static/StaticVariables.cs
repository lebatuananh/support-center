using Dvg.SupportCenter.Configurations;
using Dvg.SupportCenter.WebApp.Configurations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Dvg.SupportCenter.WebApp.Static
{
    public class StaticVariables
    {
        public static OpenfireApiConfiguration OpenfireApiConfiguration = AppSettings.Get<OpenfireApiConfiguration>("Openfire:Api");
        public static OpenfireApplicationConfiguration OpenfireApplicationConfiguration = AppSettings.Get<OpenfireApplicationConfiguration>("Openfire:Application");
        public static OpenfireUserConfiguration OpenfireUserConfiguration = AppSettings.Get<OpenfireUserConfiguration>("Openfire:User");
        public static OpenfireChatConfiguration OpenfireChatConfiguration = AppSettings.Get<OpenfireChatConfiguration>("Openfire:Chat");
    }
}
