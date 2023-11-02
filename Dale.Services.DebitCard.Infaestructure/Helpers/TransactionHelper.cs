using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Infaestructure.Helpers
{
    public class TransactionHelper
    {
        public static int GenerateUniqueRandomNumber()
        {
            using (var provider = new RNGCryptoServiceProvider())
            {
                Int32 randomInteger = 0;
                var byteArray = new byte[9];

                while (randomInteger == 0)
                {
                    provider.GetBytes(byteArray);
                    randomInteger = BitConverter.ToInt32(byteArray, 0);
                }

                return randomInteger < 0 ? randomInteger : -randomInteger;
            }
        }

        public static string GetStatusCode(int statusCode)
        {
            return string.Format("{0:D2}", statusCode);
        }
    }
}
