using Dale.Architecture.PoC.Domain.Core.Exceptions;
using Dale.Extensions.Logging.Interfaces;
using Dale.Extensions.Logging.Models;
using Dale.Services.DebitCard.Domain.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Net;

namespace Dale.Architecture.PoC.Infaestructure.Filters
{
    public class BusinessExceptionFilter : IExceptionFilter
    {
        private readonly ILogger<BusinessExceptionFilter> _logger;

        public BusinessExceptionFilter(ILogger<BusinessExceptionFilter> logger)
        {
            _logger = logger;

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="context"></param>
        public void OnException(ExceptionContext context)
        {

            Guid guidLog = Guid.NewGuid();

            _logger.LogError(new K7LogInfo() { TransaccionId = guidLog, EventId = context.HttpContext.TraceIdentifier, Description = $"No se ha podido procesar la solicitud", AdditionalData = $"{context.Exception.Message}" });

            var response = new ResponseBindingModel<ErrorMessageBindingModel>
            {
                Succeeded = false
            };

            if (context.Exception.GetType().BaseType == typeof(GeneralBusinessException))
            {
                response.Result = new ErrorMessageBindingModel { Code = "002", Message = $"{context.Exception.Message}, revise el id: {context.HttpContext.TraceIdentifier}" };
                context.Result = new BadRequestObjectResult(response);
                context.HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;

            }
            else if (context.Exception.GetType().BaseType == typeof(UnauthorizedBusinessException))
            {
                response.Result = new ErrorMessageBindingModel { Code = "003", Message = $"{context.Exception.Message}, revise el id: {context.HttpContext.TraceIdentifier}" };
                context.Result = new UnauthorizedObjectResult(response);
                context.HttpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                context.ExceptionHandled = true;
            }

            context.ExceptionHandled = true;

        }
    }
}
