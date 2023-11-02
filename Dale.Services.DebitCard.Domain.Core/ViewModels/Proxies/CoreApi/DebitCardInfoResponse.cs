using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Domain.Core.ViewModels.Proxies.CoreApi
{
    /// <summary>
    /// Response GetUserInfo CoreApi
    /// </summary>
    public class DebitCardInfoResponse
    {
        public string UserId { get; set; }
        public string CardToken { get; set; }
        public string Franchise { get; set; }
        public string Rc { get; set; }
        public string Msg { get; set; }
    }
}
