using Amazon.DynamoDBv2.DataModel;
using Dale.Services.DebitCard.Domain.Core.ViewModels.DebitCard;
using Dale.Services.DebitCard.Domain.Core.ViewModels.TokenLifeCycle;
using System;

namespace Dale.Services.DebitCard.Domain.Core.Entities
{
    /// <summary>
    /// Tokenization User Tokens Entity in dynamo DB
    /// </summary>
    [DynamoDBTable("tokenization-user-tokens")]
    public class TokenizationUserTokensEntity
    {
        [DynamoDBHashKey]
        public string TokenReferenceId { get; set; }
        public long TokenRequestorID { get; set; }
        public string UserId { get; set; }
        public string Token { get; set; }
        public string TokenType { get; set; }
        public string TokenStatus { get; set; }
        public string TokenAssuranceMethod { get; set; }
        public string LastTokenStatusUpdatedTime { get; set; }
        public ExpirationDateModel tokenExpirationDate { get; set; }
        public DateTime UpdateDate { get; set; }
        public DateTime UpdateDateUtc { get; set; }
        public DeviceInfo DeviceInfo { get; set; }
    }
}