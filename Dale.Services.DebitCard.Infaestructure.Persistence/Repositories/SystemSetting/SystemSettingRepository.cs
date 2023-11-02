using Dale.Services.DebitCard.Domain.Core.Entities;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories;
using Dapper;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Infaestructure.Persistence.Repositories.SystemSetting
{
    public class SystemSettingRepository: ISystemSettingRepository
    {
        private readonly IDbConnection _dbConnection;
        public SystemSettingRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }
        public async Task<SystemSettingEntity> GetSystemSettingsByKey(string keyName)
        {
            var query = @$"SELECT *
                           FROM SystemSettings S 
                           WHERE S.[Key] = '{keyName}'";
            var result = (await _dbConnection.QueryAsync<SystemSettingEntity>(query)).FirstOrDefault();
            return result;
        }
    }
}
