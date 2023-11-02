using Dale.Services.DebitCard.Domain.Core.ViewModels.Proxies.CoreApi;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Domain.Core.Interfaces.CoreApi
{
    public interface ICoreApiAdapter
    {
        /// <summary>
        /// method to obtain a users debit card
        /// </summary>
        /// <param name="token">token for CoreApi</param>
        /// <param name="cardNumber">Complete card number</param>
        /// <returns>DebitCardInfoResponse Object</returns>
        Task<ResponseBindingModel<DebitCardInfoResponse>> GetUserByCardNumber(string cardNumber);

        Task<ResponseBindingModel<WaloHandlingFeeResponse>> WaloHandlingFeePending(WaloHandlingFeeRequest model, string token);
        Task<ResponseBindingModel<CreateUpdateHanldingFeeResponse>> CreateHandlingFeeAllyPartner(CreateHanldingFeeRequest model, string token, bool createPay = true);
        Task<ResponseBindingModel<CreateUpdateHanldingFeeResponse>> UpdateHandlingFeeAllyPartner(UpdateHanlingFeeRequest model, string token);

        Task<TokenGeneratorResponse> GetToken(string email);
    }
}
