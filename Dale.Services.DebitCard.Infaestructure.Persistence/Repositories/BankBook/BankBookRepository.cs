using Dale.Services.DebitCard.Domain.Core.Entities;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories;
using Dale.Services.DebitCard.Infaestructure.Helpers;
using Dapper;
using System;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Infaestructure.Persistence.Repositories.BankBook
{
    public class BankBookRepository: IBankBookRepository
    {
        private readonly IDbConnection _dbConnection;
        public BankBookRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }
        public async Task<Tuple<bool, int>> GetLastBankBookIdForUser(string userId)
        {
            var query = @$"SELECT *
                           FROM BankBooks b 
                           WHERE b.UserId = '{userId}'
                           ORDER BY b.Id DESC";
            var lastBankBook = (await _dbConnection.QueryAsync<BankBookEntity>(query)).FirstOrDefault();

            bool found = lastBankBook != null;
            int value = lastBankBook?.Id ?? TransactionHelper.GenerateUniqueRandomNumber();
            return new Tuple<bool, int>(found, value);
        }
    }
}
