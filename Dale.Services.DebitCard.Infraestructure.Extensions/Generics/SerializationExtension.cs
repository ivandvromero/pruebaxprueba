using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dale.Architecture.PoC.Common.Extensions.Generics
{
    public static class SerializationExtension
    {
        public static string ConvertObjectToString(this object value)
        {
            return JsonConvert.SerializeObject(value);
        }
    }
}
