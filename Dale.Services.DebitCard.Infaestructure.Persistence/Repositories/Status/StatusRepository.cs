using Dale.Services.DebitCard.Domain.Core.Entities;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories;
using Dapper;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using static Dale.Services.DebitCard.Domain.Core.Constans.Enums;

namespace Dale.Services.DebitCard.Infaestructure.Persistence.Repositories.Status
{
    public class StatusRepository: IStatusRepository
    {
        private readonly IDbConnection _dbConnection;
        public StatusRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }
        public async Task<StatusEntity> GetStatus(string systemName, StatusTypes type)
        {
            var query = @$"SELECT *
                           FROM Status s 
                           WHERE s.SystemName = '{systemName}'
                           AND s.TypeId = {(int)type}";
            var result = (await _dbConnection.QueryAsync<StatusEntity>(query)).FirstOrDefault();
            return result;
        }
    }
}
