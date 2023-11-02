namespace Dale.Services.DebitCard.Domain.Core.Options
{
    /// <summary>
    /// Url Api Options
    /// </summary>
    public class ApiUrlsOptions
    {
        public string CoreApi { get; set; }

        public string NovopaymentTokenizationApi { get; set; }
        public string CertificatePath { get; set; }
        public string CertificatePassword { get; set; }
        public string CertificatePasswordPath { get; set; }

        public int RetryAttempts { get; set; }

        public int RetryIntervalInSeconds { get; set; }
    }
}
