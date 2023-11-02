using Dale.Services.DebitCard.Domain.Core.Entities;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories;
using Dale.Services.DebitCard.Domain.Core.Models.CashBack;
using Dapper;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Infaestructure.Persistence.Repositories.UserAgreement
{
    public class UserAgreementRepository: IUserAgreementRepository
    {
        private readonly IDbConnection _dbConnection;
        public UserAgreementRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }
        public async Task<AgreementEntity> GetUserAgreementByProgramId(string userId, string programId, int statusId)
        {
            var query = @$" SELECT * 
                            FROM UserAgreements  UA 
                            WHERE UA.AgreementId IN (SELECT Id FROM Agreements  A WHERE A.ProgramId = '{programId}')
							AND UA.UserId = '{userId}'
							AND UA.StatusId = {statusId}
							AND UA.CardSelected = '1'";
            var result = (await _dbConnection.QueryAsync<AgreementEntity>(query)).FirstOrDefault();
            return result;
        }

        public async Task<UserAgreementModel> GetUserAgreementByUserId(string userId)
        {
            string query = @$"SELECT  ua.AgreementCode
		                            ,cmd.UberAssociatedCategoryId		                            
		                            ,ua.CardSelected
		                            ,ua.CategoryId
		                            ,uac.MaxAmount
		                            ,uac.[Percentage]
		                            ,s.SystemName AS StatusAgreement
                                    ,su.SystemName AS StatusUser
                                FROM UserAgreements ua 
                                    INNER JOIN [Status] s ON ua.StatusId = s.Id
		                            INNER JOIN [AspNetUsers] u ON ua.UserId = u.Id
		                            INNER JOIN [Status] su ON u.StatusId = su.Id
		                            LEFT JOIN ClientMetaDatas cmd ON ua.CategoryId = cmd.Id
		                            LEFT JOIN UberAssociatedCategories uac ON cmd.UberAssociatedCategoryId = uac.Id
                                WHERE UserId = '{userId}' 
                                ORDER BY ua.Id DESC";
            UserAgreementModel result = (await _dbConnection.QueryAsync<UserAgreementModel>(query)).FirstOrDefault();
            return result;
        }
    }
}
