using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Domain.Core.Enumerations.Tokenization
{
    public class TokenLifeCycleEnum
    {
        public enum NovopaymentTokenStatus
        {
            TOKEN_CREATED,
            TOKEN_DEACTIVATED,
            TOKEN_SUSPEND,
            TOKEN_RESUME,
            DELETE,
            SUSPEND,
            RESUME
        }

        public enum DaleTokenStatus
        {
            Created,
            Suspend,
            Resume,
            Delete
        }
    }
}
