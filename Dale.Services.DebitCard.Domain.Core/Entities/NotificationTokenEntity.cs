using Amazon.DynamoDBv2.DataModel;
using Dale.Services.DebitCard.Domain.Core.ViewModels.NotificationToken;

namespace Dale.Services.DebitCard.Domain.Core.Entities
{
    /// <summary>
    /// Tokenization Notification Entity in dynamo DB
    /// </summary>
    [DynamoDBTable("tokenization-notifications")]
    public class NotificationTokenEntity
    {
        [DynamoDBRangeKey]
        public string IdRequest { get; set; }
        public string ClientID { get; set; }
        public string PanReferenceID { get; set; }
        public string TokenReferenceID { get; set; }
        public long TokenRequestorID { get; set; }
        public string MessageReasonCode { get; set; }
        public string DateTimeOfEvent { get; set; }

        public DeviceInfoBindingModel DeviceInfo { get; set; }
        public string EncryptedData { get; set; }
        public string UserId { get; set; }
        [DynamoDBHashKey]
        public string CardToken { get; set; }
        public string Franchise { get; set; }
    }
}
