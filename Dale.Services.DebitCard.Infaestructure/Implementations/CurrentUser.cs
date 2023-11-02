using Dale.Services.DebitCard.Domain.Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace Dale.Services.DebitCard.Infaestructure.Implementations
{
    public class CurrentUser : ICurrentUser
    {
        private readonly IHttpContextAccessor httpContextAccessor;

        public CurrentUser(IHttpContextAccessor httpContextAccessor)
        {
            this.httpContextAccessor = httpContextAccessor;


        }

        /// <summary>
        /// method to obtain the userId
        /// </summary>
        /// <returns>UserId</returns>
        public string GetCurrentUserId()
        {
            var dataUser = new { UserId = "", UserName = "" };

            var info = JsonConvert.DeserializeAnonymousType(((string)httpContextAccessor.HttpContext.Items["UserInfo"]), dataUser);

            return info.UserId;
        }

        /// <summary>
        /// method to obtain the userName
        /// </summary>
        /// <returns>UserName</returns>
        public string GetCurrentUserName()
        {
            var dataUser = new { UserId = "", UserName = "" };

            var info = JsonConvert.DeserializeAnonymousType(((string)httpContextAccessor.HttpContext.Items["UserInfo"]), dataUser);

            return info.UserName;
        }
    }
}
