using System;
using System.Collections.ObjectModel;
using System.Linq;

namespace Dale.Services.DebitCard.Infaestructure.Helpers
{
    public static class DateTimeHelpers
    {
        /// <summary>
        /// Returns TimeZone adjusted time for a given from a Utc or local time.
        /// Date is first converted to UTC then adjusted.
        /// </summary>
        /// <param name="time"></param>
        /// <param name="timeZoneInfo"></param>
        /// <returns></returns>
        public static DateTime ToTimeZoneTime(this DateTime time, TimeZoneInfo timeZoneInfo)
        {
            return TimeZoneInfo.ConvertTimeFromUtc(time, timeZoneInfo);
        }
        /// <summary>
        /// Returns TimeZone adjusted time for a given from a Utc or local time.
        /// Date is first converted to UTC then adjusted.
        /// </summary>
        /// <param name="time"></param>
        /// <param name="timeZoneId"></param>
        /// <returns></returns>
        public static DateTime ToTimeZoneTime(this DateTime time, string timeZoneId = "America/Bogota")
        {
            var tzi = TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);
            return time.ToTimeZoneTime(tzi);
        }

        public static DateTime ToUTC(this DateTime time, string timeZoneId)
        {
            time = DateTime.SpecifyKind(time, DateTimeKind.Unspecified);
            var result = TimeZoneInfo.ConvertTimeToUtc(time, GetTimesZone(timeZoneId));
            return result;
        }

        public static TimeZoneInfo GetTimesZone(string Id)
        {
            return GetTimesZones().Where(c => c.Id.Equals(Id)).FirstOrDefault();
        }

        public static ReadOnlyCollection<TimeZoneInfo> GetTimesZones()
        {
            return TimeZoneInfo.GetSystemTimeZones();
        }
    }
}
