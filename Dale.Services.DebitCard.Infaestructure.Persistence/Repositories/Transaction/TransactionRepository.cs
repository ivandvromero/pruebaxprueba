using Dale.Services.DebitCard.Domain.Core.Entities;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories;
using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Infaestructure.Persistence.Repositories.Transaction
{
    public class TransactionRepository : ITransactionRepository
    {
        private readonly IDbConnection _dbConnection;

        public TransactionRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public async Task<decimal> GetAmtConvert(string mCCUber, string mCCUberCash, string mTI, DateTime date, string userId)
        {
            string query = @$"SELECT SUM(a.AmtConvert) FROM Authorizations a INNER JOIN TRANSACTIONS T ON A.TransactionId = T.Id
                                 INNER JOIN AspNetUsers u ON T.UserId = u.Id
                            WHERE T.ResultCode = '00'
                                AND A.MCC IN ('{mCCUber}','{mCCUberCash}') 
                                AND A.MTI = '{mTI}' 
                                AND YEAR(T.[Date]) = '{date.Year}' 
                                AND MONTH(T.[Date]) = '{date.Month}'
                                AND u.Id ='{userId}'";
            IEnumerable<string> results = await _dbConnection.QueryAsync<string>(query);
            return Convert.ToDecimal(results.FirstOrDefault());
        }

        public async Task<List<TransactionEntity>> GetHandligFeeTransactions(string userId, int statusId)
        {

            var query = @$" SELECT *
                            FROM Transactions t
                            INNER JOIN HandlingFees hf ON t.Id = hf.TransactionId
                            WHERE t.UserId = '{userId}'
                            AND t.StatusId = {statusId}";
            var result = (await _dbConnection.QueryAsync<TransactionEntity>(query)).ToList();
            return result;
        }

        public async Task<bool> UpdateTransactionStatus(int transactionId, int statusId)
        {
            var query = @$"UPDATE dbo.Transactions 
                        SET StatusId = {statusId}, StatusDesc = 'Transaccion fue exitosa.'
                        WHERE Id = {transactionId};";

            await _dbConnection.QueryAsync(query);
            return true;
        }
    }
}
