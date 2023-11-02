namespace Dale.Services.DebitCard.Domain.Core.Interfaces
{
    public interface ICurrentUser
    {
        /// <summary>
        /// method to obtain the userId
        /// </summary>
        /// <returns>UserId</returns>
        string GetCurrentUserId();

        /// <summary>
        /// method to obtain the userName
        /// </summary>
        /// <returns>UserName</returns>
        string GetCurrentUserName();
    }
}
