using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Domain.Core.ViewModels.Proxies.NovopaymentDebitCard
{
    public class CredentialsResponse
    {
        public string token_type { get; set; }
        public string issued_at { get; set; }
        public string client_id { get; set; }
        public string access_token { get; set; }
        public string application_name { get; set; }
        public string expires_in { get; set; }
        public string status { get; set; }
        public string Error { get; set; }
    }
}