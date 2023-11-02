using Dale.Services.DebitCard.Domain.Core.ViewModels.DebitCard;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Domain.Core.ViewModels.PanLifecycle
{
    public class DeletePanRequestBindingModel
    {
        public string OperationReason { get; set; }
        public CardholderInfo CardholderInfo { get; set; }
    }
}
