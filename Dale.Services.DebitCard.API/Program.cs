using Dale.Extensions.AwsSecretManager;
using Dale.Extensions.Logging;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using System.Reflection;

namespace Dale.HabilitadorPSE.Authorization.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();
            host.AddConfigureLogging();
            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
            .ConfigureAppConfiguration((hostingContext, configBuilder) =>
            {
                if (!hostingContext.HostingEnvironment.IsEnvironment("Debug"))
                {
                    configBuilder.AddSecretsManager();
                }
            })
            .UseConfigureLoggingBuilder()
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.UseStartup<Startup>();
            });
    }
}
