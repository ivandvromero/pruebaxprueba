using Dale.Services.DebitCard.Domain.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories
{
    public interface ITokenizationUserTokenRepository
    {
        /// <summary>
        /// Method to save in dynamo db
        /// </summary>
        /// <param name="token">Tokenization user token  Entity</param>
        /// <returns>True</returns>
        Task<bool> Post(TokenizationUserTokensEntity token);

        Task<TokenizationUserTokensEntity> Get(string tokenReferenceId);

        /// <summary>
        /// Method for get tokens by user id
        /// </summary>
        /// <param name="userId">Identifier by user</param>
        /// <returns>Tokens list</returns>
        Task<List<TokenizationUserTokensEntity>> GetTokensByUserId(string userId);
    }
}