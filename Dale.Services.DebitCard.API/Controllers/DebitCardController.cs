using Dale.Services.DebitCard.Application.CQRSCommands.Commands.DebitCard;
using Dale.Services.DebitCard.Domain.Core.ViewModels.DebitCard;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DebitCardController : ControllerBase
    {

        private readonly IMediator _mediator;

        public DebitCardController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        [Route("VirtualToPhysical")]
        public async Task<ActionResult> DebitCardVirtualToPhysical([FromBody] DebitCardRequestBindingModel debitCardRequestViewModel)
        {
            var response = await _mediator.Send(new DebitCardVirtualToPhysicalCommand()
            {
                DebitCardRequest = debitCardRequestViewModel
            });

            if (response.Succeeded)
            {
                return Ok(response);
            }
            else if (response.ErrorResult.Code.Equals(StatusCodes.Status400BadRequest.ToString()))
            {
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }

            return StatusCode(StatusCodes.Status500InternalServerError, response);
        }

    }
}
