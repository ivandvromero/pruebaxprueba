namespace Dale.Services.DebitCard.Domain.Core.ViewModels.NotificationToken
{
    public class DeviceInfoBindingModel
    {
        public string DeviceID { get; set; }
        public string DeviceLanguageCode { get; set; }
        public string DeviceType { get; set; }
        public string DeviceName { get; set; }
        public string DeviceNumber { get; set; }
        public string OsType { get; set; }
        public string OsVersion { get; set; }
        public string OsBuildID { get; set; }
        public string DeviceIDType { get; set; }
        public string DeviceManufacturer { get; set; }
        public string DeviceBrand { get; set; }
        public string DeviceModel { get; set; }
        public string DeviceLocation { get; set; }
        public string DeviceIndex { get; set; }
        public string DeviceIPAddressV4 { get; set; }
        public string LocationSource { get; set; }
        public string TokenProtectionMethod { get; set; }
    }
}
