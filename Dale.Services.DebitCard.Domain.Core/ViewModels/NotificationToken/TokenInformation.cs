using Dale.Services.DebitCard.Domain.Core.ViewModels.DebitCard;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Domain.Core.ViewModels.NotificationToken
{
    public class TokenInformation
    {
        public string Token { get; set; }
        public string TokenType { get; set; }
        public string TokenStatus { get; set; }
        public string TokenAssuranceMethod { get; set; }
        public string LastTokenStatusUpdatedTime { get; set; }
        public ExpirationDateModel tokenExpirationDate { get; set; }
    }
}
