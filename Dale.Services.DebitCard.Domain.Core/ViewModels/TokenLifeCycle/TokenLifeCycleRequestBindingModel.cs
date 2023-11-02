using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Domain.Core.ViewModels.TokenLifeCycle
{
    public class TokenLifeCycleRequestBindingModel
    {
        public string OperationReason { get; set; }
        public string UserId { get; set; }
        public string OperationType { get; set; }
        public string TokenReferenceId { get; set; }
        public long tokenRequestorID { get; set; }
    }
}
