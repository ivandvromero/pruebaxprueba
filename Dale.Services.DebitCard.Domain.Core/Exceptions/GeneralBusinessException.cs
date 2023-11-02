using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dale.Architecture.PoC.Domain.Core.Exceptions
{
    public class GeneralBusinessException : Exception
    {
        public GeneralBusinessException()
        {
        }

        public GeneralBusinessException(string message) : base(message)
        {
        }


    }
}
