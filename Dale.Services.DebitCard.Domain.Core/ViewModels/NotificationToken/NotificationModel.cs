using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Domain.Core.ViewModels.NotificationToken
{
    public class NotificationModel
    {
        public string TokenReferenceID { get; set; }
        public long TokenRequestorID { get; set; }
        public string UserId { get; set; }
        public string CardToken { get; set; }
        public string Franchise { get; set; }
    }
}
