using Dale.Extensions.MessageBroker.Core.Events;

namespace Dale.Services.DebitCard.Application.CQRSEvents.Events.HandlingFee
{
    public class HandlingFeeCreatedEvent : Event
    {
        public HandlingFeeCreatedEvent(string application, string category, string type, string action) : base(application, category, type, action)
        {
        }

        public string UserId { get; set; }
        public int? AgreementId { get; set; }
    }
}

