using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Domain.Core.ViewModels.Proxies.CoreApi
{
    public class UpdateHanlingFeeRequest
    {
        public string UserId { get; set; }
        public int AgrementId { get; set; }
        public int StatusId { get; set; }
        public int[] IdsPendingFee { get; set; }
    }
}
