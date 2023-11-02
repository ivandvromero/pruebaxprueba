using System;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories
{
    public interface IHolidayRepository
    {
        Task<DateTime> GetNextBusinessDayAsync();
    }
}
