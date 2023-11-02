using Dale.Services.DebitCard.Domain.Core.Entities;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories;
using Dapper;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Infaestructure.Persistence.Repositories.Agreement
{
    public class AgreementRepository: IAgreementRepository
    {
        private readonly IDbConnection _dbConnection;

        public AgreementRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public async Task<AgreementEntity> GetAgreementByProgramId(string programId, int statusId)
        {

            var query = @$" SELECT * 
                            FROM Agreements  A 
                            WHERE A.ProgramId = '{programId}'
                            AND A.StatusId = {statusId} ";
            var result = (await _dbConnection.QueryAsync<AgreementEntity>(query)).FirstOrDefault();
            return result;
        }

        public async Task<AgreementEntity> GetAgreementById(int? Id)
        {

            var query = @$" SELECT * 
                            FROM Agreements  A 
                            WHERE A.Id = '{Id}'";
            var result = (await _dbConnection.QueryAsync<AgreementEntity>(query)).FirstOrDefault();
            return result;
        }
    }
}
