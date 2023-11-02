using Amazon;
using Amazon.CloudWatchLogs;
using Dale.Architecture.PoC.Common.Extensions.Generics;
using Dale.Architecture.PoC.Common.Extensions.HealthChecks;
using Dale.Architecture.PoC.Common.Extensions.Services;
using Dale.Extensions.Logging;
using Dale.Extensions.Logging.Formatter;
using Dale.Extensions.Logging.Interfaces;
using Dale.Extensions.Logging.Models;
using Dale.Extensions.MessageBroker.Core.Bus;
using Dale.Services.DebitCard.API.Extensions;
using Dale.Services.DebitCard.Application.CQRSCommands;
using Dale.Services.DebitCard.Application.CQRSEvents;
using Dale.Services.DebitCard.Application.CQRSEvents.Events.HandlingFee;
using Dale.Services.DebitCard.Application.CQRSEvents.EventsHandlers.HandlingFee;
using Dale.Services.DebitCard.Application.CQRSQueries;
using Dale.Services.DebitCard.Domain.Core.Options;
using Dale.Services.DebitCard.Infraestructure.Extensions.Services;
using Dale.Services.DebitCard.Infraestructure.Proxies;
using HealthChecks.UI.Client;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Core;
using Serilog.Events;
using Serilog.Sinks.AwsCloudWatch;
using System;
using System.Reflection;

namespace Dale.HabilitadorPSE.Authorization.API
{
    public class Startup
    {

        public IConfiguration Configuration { get; }
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            CreateLoggingStartup();
            Log.Information("Logging Inicializado para Dale.Services.DebitCard.API");
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddConfigureController();

            services.AddConfigureDbContext(Configuration);

            services.AddHealthChecksCustom(Configuration);

            services.AddConfigureCors();

            services.AddConfigureSerializationJson();

            services.AddConfigureSwagger();

            services.AddAutoMapper(typeof(Startup));

            //Change name to projects of CQRSEvents y CQRSQueries
            services.AddMediatR(Assembly.Load("Dale.Services.DebitCard.Application.CQRSCommands"),
                                Assembly.Load("Dale.Services.DebitCard.Application.CQRSQueries"));

            services.AddConfigureServiceLogger();
            services.AddConfigureServicesBusiness(Configuration);
            services.AddConfigureServicesCommandHandlers();
            services.AddConfigureServicesQueryHandlers();
            services.AddConfigureServiceProxies();
            services.AddConfigurePersistence(Configuration);
            services.AddConfigureServicesEventHandlers();

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILogger<K7LogInfo> logger)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseSwagger();

            app.ConfigureExceptionHandler(logger);

            app.UseConfigureSwagger();

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHealthChecks("/healthCheck", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions()
                {
                    Predicate = _ => true,
                    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse

                });

                endpoints.MapControllers();
            });

            ConfigureEventBusSubscription(app, logger);
        }

        private void ConfigureEventBusSubscription(IApplicationBuilder app, ILogger<K7LogInfo> logger)
        {
            try
            {
                var eventBusHandlingFee = app.ApplicationServices.GetRequiredService<IEventBusConsumer>();
                eventBusHandlingFee.Subscribe<HandlingFeeCreatedEvent, HandlingFeeCreatedEventHandler>(Configuration.GetValue<string>("QueuesNames:QueueHandlingFee").ToString());

                IEventBusConsumer eventBusCashBack = app.ApplicationServices.GetRequiredService<IEventBusConsumer>();
                eventBusCashBack.Subscribe<CashBackCreatedEvent, CashBackCreatedEventHandler>(Configuration.GetValue<string>("QueuesNames:QueueCashBackEvent").ToString());
            }
            catch (Exception ex)
            {
                logger.LogCritical(new K7LogInfo() { Description = "Error Inicializando Middleware", AdditionalData = $"Se produjo excepcion inicializacion en middleware - {ex}" });
                throw new ArgumentException($"Error Inicializando Middleware , valide los parametros configurados. {ex.Message}");
            }

        }

        /// <summary>
        ///
        /// </summary>
        private void CreateLoggingStartup()
        {
            var AWSOptions = Configuration.GetOptions<AWSOptions>("AwsSettings");
            // customer formatter
            var formatter = new CustomLogFormatter();
            var customOptions = new CloudWatchSinkOptions
            {
                // the name of the CloudWatch Log group for logging
                LogGroupName = Configuration.GetSection("Serilog:LogGroup").Value,
                // the main formatter of the log event
                TextFormatter = formatter,
                MinimumLogEventLevel = LogEventLevel.Verbose,
                BatchSizeLimit = 100,
                QueueSizeLimit = 10000,
                Period = TimeSpan.FromSeconds(10),
                CreateLogGroup = true,
                LogStreamNameProvider = new DefaultLogStreamProvider(),
                RetryAttempts = 5,
                // LogGroupRetentionPolicy = retentionPolicy,
            };
            var levelSwitch = new LoggingLevelSwitch
            {
                MinimumLevel = LogEventLevel.Debug
            };
            // setup AWS CloudWatch client
            var client = new AmazonCloudWatchLogsClient(AWSOptions.AWSAccessKey, AWSOptions.AWSSecretKey, RegionEndpoint.GetBySystemName(AWSOptions.Region));
            // Attach the sink to the logger configuration
            Log.Logger = new LoggerConfiguration()
                .WriteTo.Logger(l1 => l1
                    .MinimumLevel.ControlledBy(levelSwitch)
                    .WriteTo.AmazonCloudWatch(customOptions, client))
              .CreateLogger();
        }

    }
}
