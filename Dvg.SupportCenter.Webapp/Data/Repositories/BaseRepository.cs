using Dvg.SupportCenter.Data.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Dvg.SupportCenter.Data.Repositories
{
    public class BaseRepository : IRepository
    {
        protected readonly CustomHttpClient restClient;
        public BaseRepository(
            OpenfireHttpClient restClient
            )
        {
            this.restClient = restClient;
        }
    }
}
