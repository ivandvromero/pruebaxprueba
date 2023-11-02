using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using Amazon.DynamoDBv2.Model;
using AutoMapper;
using Dale.Services.DebitCard.Domain.Core.Entities;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories;
using Dale.Services.DebitCard.Domain.Core.ViewModels.NotificationToken;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Infaestructure.Persistence.Repositories.Tokenization
{
    public class NotificationTokenRepository : INotificationTokenRepository
    {
        private readonly IDynamoDBContext _dynamoDbContext;
        private readonly IMapper _mapper;

        public NotificationTokenRepository(IDynamoDBContext dynamoDbContext,
                                           IMapper mapper)
        {
            _dynamoDbContext = dynamoDbContext;
            _mapper = mapper;
        }

        /// <summary>
        /// Method to save in dynamo db
        /// </summary>
        /// <param name="notification">Notification Entity</param>
        /// <returns>True</returns>
        public async Task<bool> Post(NotificationTokenEntity notification)
        {
            await _dynamoDbContext.SaveAsync(notification);
            return true;
        }

        /// <summary>
        /// Method to get notification by user id
        /// </summary>
        /// <param name="userId">User id</param>
        /// <returns>NotificationModel</returns>
        public async Task<NotificationTokenEntity> Get(string userId)
        {

            QueryFilter filter = new QueryFilter("UserId", QueryOperator.Equal, new List<AttributeValue> { new AttributeValue(userId) });
            AsyncSearch<NotificationTokenEntity> results = _dynamoDbContext.FromQueryAsync<NotificationTokenEntity>(new QueryOperationConfig()
            {
                IndexName = "UserId-index",
                ConditionalOperator = ConditionalOperatorValues.And,
                Filter = filter,
                Limit = 1,
                BackwardSearch = true
            });
            List<NotificationTokenEntity> documentSet = await results.GetNextSetAsync();

            return  documentSet.FirstOrDefault();
        }

    }
}
