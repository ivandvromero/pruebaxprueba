using Dale.Services.DebitCard.Domain.Core.Entities;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories;
using Dapper;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Infaestructure.Persistence.Repositories.DebitCard
{
    public class DebitCardRepository: IDebitCardRepository
    {
        private readonly IDbConnection _dbConnection;
        public DebitCardRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }
        public async Task<DebitCardEntity> GetDebitCard(string userId)
        {
            var query = @$"SELECT *
                           FROM DebitCards dc 
                           WHERE dc.UserId = '{userId}'
                           ORDER BY dc.Id DESC";
            var result = (await _dbConnection.QueryAsync<DebitCardEntity>(query)).FirstOrDefault();
            return result;
        }
        public async Task<UserEntity> GetUserByCardTokenDebitCard(string cardtoken)
        {
            var query = @$"select  us.Id, us.FirstName, us.LastName, us.Email from  AspNetUsers us
                           inner join DebitCards db
                           on us.id = db.UserId
                           where db.CardToken = '{cardtoken}'";
            var result = (await _dbConnection.QueryAsync<UserEntity>(query)).FirstOrDefault();
            return result;
        }
    }
}
