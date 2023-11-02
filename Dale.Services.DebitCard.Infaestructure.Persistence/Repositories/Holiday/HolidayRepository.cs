using Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories;
using Dale.Services.DebitCard.Infaestructure.Helpers;
using System;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Infaestructure.Persistence.Repositories.Holiday
{
    public class HolidayRepository: IHolidayRepository
    {
        public async Task<DateTime> GetNextBusinessDayAsync()
        {
            var columbianDateTime = DateTime.UtcNow.ToTimeZoneTime();
            var time9pm = new DateTime(columbianDateTime.Year, columbianDateTime.Month, columbianDateTime.Day, 21, 0, 0);
            //check if current time is greater that 9pm(off time) or current date is holiday or not?
            var isHolidayOrOffTime = columbianDateTime > time9pm || (await IsHoliday(columbianDateTime));
            while (isHolidayOrOffTime)
            {
                columbianDateTime = columbianDateTime.AddDays(1);
                isHolidayOrOffTime = await IsHoliday(columbianDateTime);
            }
            time9pm = new DateTime(columbianDateTime.Year, columbianDateTime.Month, columbianDateTime.Day, 21, 0, 0);
            return time9pm;
        }

        public async Task<bool> IsHoliday(DateTime date)
        {
            bool isHoliday = false;
            if (date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday)
                isHoliday = true;
            return isHoliday;
        }
    }
}
