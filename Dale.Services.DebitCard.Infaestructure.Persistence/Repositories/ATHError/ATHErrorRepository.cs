using Dale.Services.DebitCard.Domain.Core.Entities;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories;
using Dapper;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Infaestructure.Persistence.Repositories.ATHError
{
    public class ATHErrorRepository: IATHErrorRepository
    {
        private readonly IDbConnection _dbConnection;

        public ATHErrorRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }
        public async Task<ATHErrorEntity> GetByCode(string code)
        {
            var query = @$"SELECT *
                           FROM ATHErrors e
                           WHERE e.InternalCode = '{code}'";
            var result = (await _dbConnection.QueryAsync<ATHErrorEntity>(query)).FirstOrDefault();
            return result;
        }
    }
}
