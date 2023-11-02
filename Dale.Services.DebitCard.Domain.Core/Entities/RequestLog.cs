using Dale.Services.DebitCard.Domain.Core.Enumerations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Domain.Core.Entities
{
    public class RequestLog
    {
        public int Id { get; set; }
        public RequestLogTypes Type { get; set; }
        public string RequestData { get; set; }
        public string ResponseData { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    }
}
