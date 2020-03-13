using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Dvg.SupportCenter.WebApp.Registrations
{
    public class AutoMapperInitiator
    {
        public static void Init()
        {
            Mapper.Initialize(cfg =>
            {
                cfg.CreateMissingTypeMaps = true;
                cfg.AllowNullCollections = true;
                cfg.ForAllMaps((map, exp) =>
                {
                    foreach (var unmappedPropertyName in map.GetUnmappedPropertyNames())
                        exp.ForMember(unmappedPropertyName, opt => opt.Ignore());
                });

                RegisterMapping(cfg);
            });
        }

        public static void RegisterMapping(IMapperConfigurationExpression cfg)
        {
            

        }
    }
}
