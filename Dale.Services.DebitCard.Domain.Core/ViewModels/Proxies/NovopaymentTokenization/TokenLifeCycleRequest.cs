using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Domain.Core.ViewModels.Proxies.NovopaymentTokenization
{
    public class TokenLifeCycleRequest
    {
        public string operatorID { get; set; }
        public string operationType { get; set; }
        public string operationReason { get; set; }
        public string tokenReferenceID { get; set; }
        public long tokenRequestorID { get; set; }
    }
}
