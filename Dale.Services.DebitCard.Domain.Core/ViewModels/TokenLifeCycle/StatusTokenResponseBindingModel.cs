using Dale.Services.DebitCard.Domain.Core.ViewModels.NotificationToken;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Domain.Core.ViewModels.TokenLifeCycle
{
    public class StatusTokenResponseBindingModel
    {
        public string TokenReferenceId { get; set; }
        public long TokenRequestorID { get; set; }
        public string UserId { get; set; }
        public string TokenStatus { get; set; }
        public string ExpirationDate { get; set; }
        public DeviceInfoBindingModel DevideInfo { get; set; }
    }
}
