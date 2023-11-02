using Dale.Services.DebitCard.Application.CQRSCommands.Commands.Tokenization;
using Dale.Services.DebitCard.Domain.Core.ViewModels.PanLifecycle;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PanLifeCycleController : ControllerBase
    {

        private readonly IMediator _mediator;

        public PanLifeCycleController(
            IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        [Route("CancelationPan")]
        public async Task<ActionResult> CancelationPan([FromBody] DeletePanRequestBindingModel deletePanRequestViewModel)
        {
            var response = await _mediator.Send(new DeletePanCommand()
            {
                DeletePanRequest = deletePanRequestViewModel
            });

            if (response.Succeeded)
            {
                return Ok(response);
            }

            return StatusCode(StatusCodes.Status500InternalServerError, response.ErrorResult);
        }

        [HttpPost]
        [Route("UpdatePan")]
        public async Task<ActionResult> UpdatePan([FromBody] UpdatePanRequestBindingModel updatePanRequestViewModel)
        {
            var response = await _mediator.Send(new UpdatePanCommand()
            {
                UpdatePanRequestBindingModel = updatePanRequestViewModel
            });

            if (response.Succeeded)
            {
                return Ok(response);
            }

            return StatusCode(StatusCodes.Status500InternalServerError, response.ErrorResult);
        }
    }
}
