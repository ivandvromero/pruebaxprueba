using Dale.Extensions.MessageBroker.Core.Events;

namespace Dale.Services.DebitCard.Application.CQRSEvents.Events.HandlingFee
{
    public class CashBackCreatedEvent : Event
    {
        public CashBackCreatedEvent(string application, string category, string type, string action) : base(application, category, type, action)
        {
        }

        public string UserId { get; set; }
    }
}

