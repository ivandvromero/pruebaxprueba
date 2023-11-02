using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using Amazon.DynamoDBv2.Model;
using Dale.Services.DebitCard.Domain.Core.Entities;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Infaestructure.Persistence.Repositories.Tokenization
{
    public class TokenizationUserTokenRepository : ITokenizationUserTokenRepository
    {
        private readonly IDynamoDBContext _dynamoDbContext;
        private readonly IAmazonDynamoDB _amazonDynamoDB;
        private readonly IConfiguration _configuration;

        public TokenizationUserTokenRepository(IDynamoDBContext dynamoDbContext,
                                               IAmazonDynamoDB amazonDynamoDB,
                                               IConfiguration configuration)
        {
            _dynamoDbContext = dynamoDbContext;
            _amazonDynamoDB = amazonDynamoDB;
            _configuration = configuration;
        }

        /// <summary>
        /// Method to save in dynamo db
        /// </summary>
        /// <param name="token">Tokenization user token  Entity</param>
        /// <returns>True</returns>
        public async Task<bool> Post(TokenizationUserTokensEntity token)
        {
            await _dynamoDbContext.SaveAsync(token);
            return true;
        }

        public async Task<TokenizationUserTokensEntity> Get(string tokenReferenceId)
        {

            QueryFilter filter = new QueryFilter("TokenReferenceId", QueryOperator.Equal, new List<AttributeValue> { new AttributeValue(tokenReferenceId) });
            AsyncSearch<TokenizationUserTokensEntity> results = _dynamoDbContext.FromQueryAsync<TokenizationUserTokensEntity>(new QueryOperationConfig()
            {
                Filter = filter,
                Limit = 1,
                BackwardSearch = true
            });
            List<TokenizationUserTokensEntity> documentSet = await results.GetNextSetAsync();

            return documentSet.FirstOrDefault();
        }

        public async Task<List<TokenizationUserTokensEntity>> GetTokensByUserId(string userId)
        {
            List<TokenizationUserTokensEntity> documentSet = new List<TokenizationUserTokensEntity>();
            ExecuteStatementRequest executeStatementRequest = new ExecuteStatementRequest();
            List<AttributeValue> parameters = new List<AttributeValue>
            {
                new AttributeValue(userId),
                new AttributeValue("Active"),
                new AttributeValue("Resume")
            };

            string prefixDynamo = _configuration.GetSection("PrefixDynamoDB").Value;

            executeStatementRequest.Statement = $"SELECT * FROM  \"{prefixDynamo}tokenization-user-tokens\".\"UserId-TokenStatus-index\" " +
                $"                               WHERE UserId = ? AND (TokenStatus <>'DEACTIVATED')";
            executeStatementRequest.Parameters = parameters;
            var documents = await _amazonDynamoDB.ExecuteStatementAsync(executeStatementRequest);

            foreach (Dictionary<string, AttributeValue> item in documents.Items)
            {
                var document = Document.FromAttributeMap(item);
                var typedDocument = _dynamoDbContext.FromDocument<TokenizationUserTokensEntity>(document);
                documentSet.Add(typedDocument);
            }

            return documentSet;
        }

    }
}