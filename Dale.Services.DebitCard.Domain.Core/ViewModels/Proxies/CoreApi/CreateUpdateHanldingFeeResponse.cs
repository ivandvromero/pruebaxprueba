using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Domain.Core.ViewModels.Proxies.CoreApi
{
    public class CreateUpdateHanldingFeeResponse
    {
        public string ResponseMsg { get; set; }
        public string StatusCode { get; set; }
        public DateTime ProcessedAt { get; set; }
        public bool IsSuccess { get; set; }

    }
}
