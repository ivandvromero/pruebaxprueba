using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dale.Architecture.PoC.Common.Extensions.Generics
{
    public static class HttpContextAccessorExtension
    {
        public static string GetIdentifierRequest(this IHttpContextAccessor httpContextAccessor)
        {
            return httpContextAccessor.HttpContext.TraceIdentifier;
        }


    }
}
