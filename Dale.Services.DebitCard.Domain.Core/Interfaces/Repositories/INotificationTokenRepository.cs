using Dale.Services.DebitCard.Domain.Core.Entities;
using Dale.Services.DebitCard.Domain.Core.ViewModels.NotificationToken;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories
{
    public interface INotificationTokenRepository
    {
        /// <summary>
        /// Method to save in dynamo db
        /// </summary>
        /// <param name="notification">Notification Entity</param>
        /// <returns>True</returns>
        Task<bool> Post(NotificationTokenEntity notification);

        /// <summary>
        /// Method to get notification by user id
        /// </summary>
        /// <param name="userId">User id</param>
        /// <returns>NotificationModel</returns>
        Task<NotificationTokenEntity> Get(string userId);
    }
}
