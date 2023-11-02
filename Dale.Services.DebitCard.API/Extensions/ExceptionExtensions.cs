using Dale.Extensions.Logging.Models;
using Dale.Services.DebitCard.Domain.Core;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using System;
using System.Net;

namespace Dale.Services.DebitCard.API.Extensions
{
    public static class ExceptionExtensions
    {
        public static void ConfigureExceptionHandler(this IApplicationBuilder app, Dale.Extensions.Logging.Interfaces.ILogger<K7LogInfo> logger)
        {
            app.UseExceptionHandler(appError =>
            {

                appError.Run(async context =>
                {

                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    context.Response.ContentType = "application/json";
                    var contextFeature = context.Features.Get<IExceptionHandlerFeature>();
                    if (contextFeature != null)
                    {
                        Guid guidLog = Guid.NewGuid();

                        logger.LogCritical(new K7LogInfo() { TransaccionId = guidLog, EventId = context.TraceIdentifier, Description = $"No se ha podido procesar la solicitud", AdditionalData = $"{contextFeature.Error}" });
                        await context.Response.WriteAsync(
                         new ResponseBindingModel<ErrorMessageBindingModel>
                         {
                             Succeeded = false,
                             Result = new ErrorMessageBindingModel { Code = "001", Message = $"No se ha podido procesar la solicitud , revise el id: {context.TraceIdentifier}" }
                         }.ToString());
                    }

                });
            });
        }
    }
}
