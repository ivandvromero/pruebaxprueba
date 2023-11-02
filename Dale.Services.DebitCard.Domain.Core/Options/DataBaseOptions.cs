using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Domain.Core.Options
{
    public class DataBaseOptions
    {
        public string Host { get; set; }
        public string DatabaseName { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Engine { get; set; }
        public int Port { get; set; }
        public string DbInstanceIdentifier { get; set; }
    }
}
