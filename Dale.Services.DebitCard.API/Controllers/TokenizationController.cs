using Dale.Services.DebitCard.Application.CQRSCommands.Commands.Tokenization;
using Dale.Services.DebitCard.Domain.Core.ViewModels.NotificationToken;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TokenizationController : ControllerBase
    {
        private readonly IMediator _mediator;

        public TokenizationController(
            IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Save token notification
        /// </summary>
        /// <param name="notificationRequestViewModel">Notification Request</param>
        /// <param name="clientID">Client Id</param>
        /// <param name="authorization">Bearer Token for CoreApi</param>
        /// <returns>Http status code</returns>
        [HttpPost]
        [Route("itsp/{clientID}/vtis/v1/notification")]
        public async Task<ActionResult> Notification([FromBody] NotificationTokenRequestBindingModel notificationRequestViewModel,
            [MaxLength(length: 32, ErrorMessage = "El client ID debe tener maximo 32 caracteres")] string clientID)
        {
            var response = await _mediator.Send(new CreateNotificationTokenCommand()
            {
                ClientID = clientID,
                NotificationTokenRequest = notificationRequestViewModel
            });

            if (response.Succeeded)
            {
                return Ok(response);
            }
            else if (response.ErrorResult.Code.Equals(StatusCodes.Status400BadRequest.ToString()))
            {
                return StatusCode(StatusCodes.Status400BadRequest, response.ErrorResult);
            }

            return StatusCode(StatusCodes.Status500InternalServerError, response.ErrorResult);
        }
    }
}
