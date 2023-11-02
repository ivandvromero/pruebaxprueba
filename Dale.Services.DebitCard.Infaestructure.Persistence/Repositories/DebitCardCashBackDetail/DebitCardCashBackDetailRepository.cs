using Dale.Services.DebitCard.Domain.Core.Entities;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories;
using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Infaestructure.Persistence.Repositories
{
    public class DebitCardCashBackDetailRepository : IDebitCardCashBackDetailRepository
    {
        private readonly IDbConnection _dbConnection;

        public DebitCardCashBackDetailRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }
        public async Task<bool> InsertCardCashBackFailedTransaction(List<DebitCardCashBackDetailEntity> ltsDebitCardCashBackDetail, int status)
        {
            bool result = false;
            using (var transactionScope = _dbConnection.BeginTransaction())
            {
                try
                {
                    foreach (DebitCardCashBackDetailEntity debitCardCashBackDetail in ltsDebitCardCashBackDetail)
                    {
                        string query = $@"DECLARE @IdDebitCardCashBackDetail INT = '{debitCardCashBackDetail.Id}'
		                                                ,@StatusId INT = '{status}'
		                                                ,@Successful BIT = 1
		                                                ,@Failed BIT = 0
                                                SET NOCOUNT ON;  

	                                            IF EXISTS(SELECT [Id] FROM [dbo].[DebitCardCashBackDetails] NOLOCK 
	                                            WHERE [Id] = @IdDebitCardCashBackDetail)
		                                            BEGIN
			                                            UPDATE [dbo].[DebitCardCashBackDetails]
			                                            SET [StatusId] = @StatusId
                                                        WHERE [Id] = @IdDebitCardCashBackDetail
			                                            SELECT @Successful;
		                                            END
	                                            ELSE 
		                                            BEGIN
			                                            SELECT @Failed;
		                                            END";
                        result = (await _dbConnection.QueryAsync<bool>(query)).FirstOrDefault();
                        if (!result)
                            return result;
                    }
                    result = true;
                    transactionScope.Commit();
                }
                catch (Exception ex)
                {
                    transactionScope.Rollback();
                }
            }
            return result;
        }
    }
}
