using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Domain.Core.ViewModels.Proxies.CoreApi
{
    /// <summary>
    /// Request Debit Card User Info CoreApi
    /// </summary>
    public class DebitCardUserInfoRequest
    {
        public string CardNumber { get; set; }
    }
}
