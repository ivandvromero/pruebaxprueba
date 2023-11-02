using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dale.Architecture.PoC.Domain.Core.Exceptions
{
    public class UnauthorizedBusinessException : Exception
    {
        public UnauthorizedBusinessException()
        {
        }

        public UnauthorizedBusinessException(string message) : base(message)
        {
        }


    }

}
