using Dale.Services.DebitCard.Domain.Core.Entities;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories;
using Dapper;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Infaestructure.Persistence.Repositories.ProductBalance
{
    public class ProductBalanceRepository: IProductBalanceRepository
    {
        private readonly IDbConnection _dbConnection;

        public ProductBalanceRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public async Task<ProductBalanceEntity> GetBalanceByUserId(string userId)
        {

            var query = @$" SELECT * 
                            FROM ProductBalance P 
                            WHERE P.UserId = '{userId}'";
            var result = (await _dbConnection.QueryAsync<ProductBalanceEntity>(query)).FirstOrDefault();
            return result;
        }
    }
}
