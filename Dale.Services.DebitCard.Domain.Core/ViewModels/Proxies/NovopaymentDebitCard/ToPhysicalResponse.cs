using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Domain.Core.ViewModels.Proxies.NovopaymentDebitCard
{
    public class ToPhysicalResponse
    {
        public string code { get; set; }
        public string message { get; set; }
        public string datetime { get; set; }
    }
}
