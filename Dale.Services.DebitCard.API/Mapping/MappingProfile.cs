using AutoMapper;
using Dale.Services.DebitCard.Domain.Core.Entities;
using Dale.Services.DebitCard.Domain.Core.ViewModels.NotificationToken;
using Dale.Services.DebitCard.Domain.Core.ViewModels.PanLifecycle;
using Dale.Services.DebitCard.Domain.Core.ViewModels.Proxies.NovopaymentTokenization;
using Dale.Services.DebitCard.Domain.Core.ViewModels.TokenLifeCycle;

namespace Dale.Architecture.PoC.API.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<NotificationTokenRequestBindingModel, NotificationTokenEntity>();
            CreateMap<DeletePanRequestBindingModel, PanLifecycleRequest>();
            CreateMap<NotificationTokenEntity, NotificationModel>();
            CreateMap<TokenizationUserTokensEntity, StatusTokenResponseBindingModel>();
            CreateMap<DeviceInfoBindingModel, DeviceInfo>();
            CreateMap<DeviceInfo, DeviceInfoBindingModel>();
        }
    }
}
