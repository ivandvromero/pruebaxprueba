using Amazon;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.Runtime;
using Dale.Architecture.PoC.Common.Extensions.Generics;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories;
using Dale.Services.DebitCard.Domain.Core.Options;
using Dale.Services.DebitCard.Infaestructure.Persistence.Repositories;
using Dale.Services.DebitCard.Infaestructure.Persistence.Repositories.Agreement;
using Dale.Services.DebitCard.Infaestructure.Persistence.Repositories.ATHError;
using Dale.Services.DebitCard.Infaestructure.Persistence.Repositories.BankBook;
using Dale.Services.DebitCard.Infaestructure.Persistence.Repositories.CashBack;
using Dale.Services.DebitCard.Infaestructure.Persistence.Repositories.DebitCard;
using Dale.Services.DebitCard.Infaestructure.Persistence.Repositories.FeeStructure;
using Dale.Services.DebitCard.Infaestructure.Persistence.Repositories.HandlingFee;
using Dale.Services.DebitCard.Infaestructure.Persistence.Repositories.Holiday;
using Dale.Services.DebitCard.Infaestructure.Persistence.Repositories.ProductBalance;
using Dale.Services.DebitCard.Infaestructure.Persistence.Repositories.Status;
using Dale.Services.DebitCard.Infaestructure.Persistence.Repositories.SystemSetting;
using Dale.Services.DebitCard.Infaestructure.Persistence.Repositories.Tokenization;
using Dale.Services.DebitCard.Infaestructure.Persistence.Repositories.Transaction;
using Dale.Services.DebitCard.Infaestructure.Persistence.Repositories.User;
using Dale.Services.DebitCard.Infaestructure.Persistence.Repositories.UserAgreement;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;
using System.Data;

namespace Dale.Services.DebitCard.Infraestructure.Extensions.Services
{
    public static class TokenizationServicesPersistenceExtension
    {
        public static IServiceCollection AddConfigurePersistence(this IServiceCollection services, IConfiguration Configuration)
        {
            var DynamoDBOptions = Configuration.GetOptions<AWSOptions>("AwsSettings");
            var region = RegionEndpoint.GetBySystemName(DynamoDBOptions.Region);

            var awsSettings = Configuration.GetOptions<AWSOptions>("AwsSettings");
            var options = Configuration.GetAWSOptions();

            if (awsSettings.AuthType != "IAMRole")
            {
                options.Credentials = new BasicAWSCredentials(awsSettings.AWSAccessKey, awsSettings.AWSSecretKey);
            }

            options.Region = RegionEndpoint.GetBySystemName(awsSettings.Region);

            services.AddDefaultAWSOptions(options);

            if (awsSettings.AuthType != "IAMRole")
            {
                services.AddSingleton<IAmazonDynamoDB>(new AmazonDynamoDBClient(
                   new BasicAWSCredentials(awsSettings.AWSAccessKey, awsSettings.AWSSecretKey), region));
            }
            else
            {
                services.AddSingleton<IAmazonDynamoDB>(new AmazonDynamoDBClient(region));
            }
            
            services.AddSingleton<IDynamoDBContext, DynamoDBContext>(
                x => new DynamoDBContext(x.GetRequiredService<IAmazonDynamoDB>(),
                     new DynamoDBContextConfig() { TableNamePrefix = Configuration.GetValue<string>("PrefixDynamoDB") }));

            #region [ IDbConnection ]

            var dbSecretsOptions = Configuration.GetOptions<DataBaseOptions>("DbSecrets");

            var connectionString = $"Data Source={dbSecretsOptions.Host};Initial Catalog={dbSecretsOptions.DatabaseName};Integrated Security=True;";
            if (dbSecretsOptions.Port != 0)
                connectionString = $"Data Source={dbSecretsOptions.Host},{dbSecretsOptions.Port}; Initial Catalog={dbSecretsOptions.DatabaseName};" +
                        $"User Id={dbSecretsOptions.Username}; Password={dbSecretsOptions.Password};Encrypt=True;TrustServerCertificate=True;";

            services.AddScoped<IDbConnection>(x => new SqlConnection(connectionString));

            //var multiplexer = ConnectionMultiplexer.Connect(Configuration.GetValue<string>("Redis:Endpoint"));
            //services.AddSingleton<IConnectionMultiplexer>(multiplexer);

            #endregion

            services.AddScoped<INotificationTokenRepository, NotificationTokenRepository>();
            services.AddScoped<IRequestLogsRepository, RequestLogsRepository>();
            services.AddScoped<ITokenizationUserTokenRepository, TokenizationUserTokenRepository>();
            services.AddScoped<IHandlingFeeRepository, HandlingFeeRepository>();
            services.AddScoped<IStatusRepository, StatusRepository>();
            services.AddScoped<IDebitCardRepository, DebitCardRepository>();
            services.AddScoped<IBankBookRepository, BankBookRepository>();
            services.AddScoped<IHolidayRepository, HolidayRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IATHErrorRepository, ATHErrorRepository>();
            services.AddScoped<IAgreementRepository, AgreementRepository>();
            services.AddScoped<IUserAgreementRepository, UserAgreementRepository>();
            services.AddScoped<IFeeStructureRepository, FeeStructureRepository>();
            services.AddScoped<IProductBalanceRepository, ProductBalanceRepository>();
            services.AddScoped<ITransactionRepository, TransactionRepository>();
            services.AddScoped<ISystemSettingRepository, SystemSettingRepository>();
            services.AddScoped<ICashBackRepository, CashBackRepository>();
            services.AddScoped<IDebitCardCashBackDetailRepository, DebitCardCashBackDetailRepository>();

            return services;
        }
    }
}
