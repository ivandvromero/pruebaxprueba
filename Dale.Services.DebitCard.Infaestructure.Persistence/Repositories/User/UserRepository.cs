using Dale.Services.DebitCard.Domain.Core.Entities;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories;
using Dapper;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Infaestructure.Persistence.Repositories.User
{
    public class UserRepository: IUserRepository
    {
        private readonly IDbConnection _dbConnection;
        public UserRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }
        public async Task<UserEntity> GetUserById(string userId)
        {
            var query = @$"SELECT *
                           FROM AspNetUsers u 
                           WHERE u.Id = '{userId}'
                           ORDER BY u.CreatedAt DESC";
            var result = (await _dbConnection.QueryAsync<UserEntity>(query)).FirstOrDefault();
            return result;
        }

        public async Task<bool> UpdateUserStatus(string userId, int statusId)
        {
            var query = $@"UPDATE AspNetUsers SET StatusId = {statusId} WHERE Id = '{userId}'";
            await _dbConnection.QueryAsync(query);
            return true;
        }

        public async Task<bool> UpdateDebitCardUserStatus(string userId, int statusId)
        {
            var query = $@"UPDATE DebitCards SET StatusId = {statusId} 
                            WHERE Id in (SELECT TOP(1) Id 
                            FROM DebitCards WHERE UserId = '{userId}'
                            ORDER BY Id DESC)";
            await _dbConnection.QueryAsync(query);
            return true;
        }
    }
}
