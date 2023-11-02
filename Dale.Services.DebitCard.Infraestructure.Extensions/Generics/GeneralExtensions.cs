using Dale.Architecture.PoC.Infaestructure.Filters;
using Dale.Services.DebitCard.Domain.Core.Options;
using Dale.Services.DebitCard.Infaestructure.Persistence.Context;
using Dale.Services.DebitCard.Infaestructure.Validators.NotificationTokenValidators;
using Dale.Services.DebitCard.Infaestructure.Validators.PanLifecycleValidators;
using Dale.Services.DebitCard.Infaestructure.Validators.TokenLifeCycleValidators;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;

namespace Dale.Architecture.PoC.Common.Extensions.Generics
{
    public static class GeneralExtensions
    {
        public static TModel GetOptions<TModel>(this IConfiguration configuration, string section) where TModel : new()
        {
            var model = new TModel();
            configuration.GetSection(section).Bind(model);

            return model;
        }

        public static void AddConfigureSwagger(this IServiceCollection services)
        {
            services.AddSwaggerGen(setup =>
            {
                setup.SwaggerDoc("v1", new OpenApiInfo() { Title = "Dale.Services.DebitCard.API", Version = "V1" });
            });
        }

        public static void UseConfigureSwagger(this IApplicationBuilder app)
        {
            app.UseSwaggerUI(setup =>
                {
                    setup.SwaggerEndpoint("/swagger/v1/swagger.json", "Dale.Services.DebitCard.API API");

                }
            );
        }

        public static void AddConfigureSerializationJson(this IServiceCollection services)
        {

            services.AddControllers().AddNewtonsoftJson(options =>
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);
        }

        public static void AddConfigureCors(this IServiceCollection services)
        {
            services.AddCors(setup =>
            {
                setup.AddPolicy("CorsPolicy",
                    builder => builder.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader());
            });
        }

        public static void AddConfigureDbContext(this IServiceCollection services, IConfiguration configuration)
        {
            var dbSecretsOptions = configuration.GetOptions<DataBaseOptions>("DbSecrets");
            var connectionString = "";
            if (dbSecretsOptions.Port != 0)
            {
                connectionString = $"Data Source={dbSecretsOptions.Host},{dbSecretsOptions.Port};" +
                            $"Initial Catalog={dbSecretsOptions.DatabaseName};" +
                            $"User Id={dbSecretsOptions.Username}; Password={dbSecretsOptions.Password};Encrypt=True;TrustServerCertificate=True;";
            }
            else
            {
                connectionString = $"Data Source={dbSecretsOptions.Host};" +
                           $"Initial Catalog={dbSecretsOptions.DatabaseName};" +
                           $"Integrated Security=True;";
            }

            services.AddDbContextPool<ApplicationDbContext>(options =>
            {
                options.UseSqlServer(connectionString,
                    builder => builder.MigrationsHistoryTable("__EFMigrationsHistory", "dbo"));
            });
        }

        public static IServiceCollection AddConfigureController(this IServiceCollection services)
        {
            services.AddControllers(options =>
            {
                options.Filters.Add<BusinessExceptionFilter>();
            }).AddFluentValidation(cfg => cfg.RegisterValidatorsFromAssemblyContaining<NotificationTokenBindingModelValidator>())
            .AddFluentValidation(cfg => cfg.RegisterValidatorsFromAssemblyContaining<DeletePanBindingModelValidator>())
            .AddFluentValidation(cfg => cfg.RegisterValidatorsFromAssemblyContaining<UpdatePanBindingModelValidator>())
            .AddFluentValidation(cfg => cfg.RegisterValidatorsFromAssemblyContaining<DeleteTokenBindingModelValidator>());


            return services;
        }
    }
}
