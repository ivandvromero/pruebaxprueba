using Dale.Services.DebitCard.Domain.Core.Entities;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories;
using Dapper;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Infaestructure.Persistence.Repositories.FeeStructure
{
    public class FeeStructureRepository: IFeeStructureRepository
    {
        private readonly IDbConnection _dbConnection;

        public FeeStructureRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public async Task<FeeStructureEntity> GetFeeStructureByAgreementId(int agreementId)
        {

            var query = @$" SELECT * 
                            FROM FeeStructures F 
                            WHERE F.AgreementId = '{agreementId}'";
            var result = (await _dbConnection.QueryAsync<FeeStructureEntity>(query)).FirstOrDefault();
            return result;
        }
    }
}
