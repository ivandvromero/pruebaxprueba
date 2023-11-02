using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Domain.Core.Enumerations.Tokenization
{
    public class PanLifecycleEnum
    {
        public enum OperationType
        {
            DELETE,
            UPDATE
        }

        public enum OperationReasonCode
        {
            ACCOUNT_UPDATE,
            ACCOUNT_CLOSED,
            EXP_DATE_UPDATE,
            CONTACT_CARDHOLDER,
            PORTFOLIO_CONVERSION
        }

    }
}
