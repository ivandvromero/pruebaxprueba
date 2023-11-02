using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Domain.Core.ViewModels.Proxies.CoreApi
{
    public class CreateHanldingFeeRequest
    {
        public int AgreementId { get; set; }
        public decimal Amount { get; set; }
        public string UserId { get; set; }
        public int StatusId { get; set; }
    }
}
