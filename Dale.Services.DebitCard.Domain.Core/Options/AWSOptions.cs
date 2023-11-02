namespace Dale.Services.DebitCard.Domain.Core.Options
{
    /// <summary>
    /// AWS Secrets
    /// </summary>
    public class AWSOptions
    {
        public string AWSSecretKey { get; set; }
        public string AWSAccessKey { get; set; }
        public string Region { get; set; }
        public string AuthType { get; set; }
    }
}
