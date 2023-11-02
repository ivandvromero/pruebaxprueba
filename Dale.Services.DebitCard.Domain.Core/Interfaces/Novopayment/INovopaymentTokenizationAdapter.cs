using Dale.Services.DebitCard.Domain.Core.ViewModels.Proxies.NovopaymentTokenization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Domain.Core.Interfaces.Novopayment
{
    public interface INovopaymentTokenizationAdapter
    {
        /// <summary>
        /// method to send PAN life cycle request
        /// </summary>
        /// <param name="body">PanLifecycleRequest Object</param>
        /// <returns>true if successful</returns>
        Task<ResponseBindingModel<string>> PanLifecycle(PanLifecycleRequest body, string clientId);

        /// <summary>
        /// method to send token life cycle request
        /// </summary>
        /// <param name="body">TokenLifecycleRequest Object</param>
        /// <param name="clientId">Dale client id</param>
        /// <returns>true if successful</returns>
        Task<ResponseBindingModel<bool>> TokenLifecycle(TokenLifeCycleRequest body, string clientId);
    }
}
