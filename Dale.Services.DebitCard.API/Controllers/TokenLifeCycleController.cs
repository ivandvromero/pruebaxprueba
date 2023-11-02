using Dale.Services.DebitCard.Application.CQRSCommands.Commands.Tokenization;
using Dale.Services.DebitCard.Application.CQRSQueries.Querys.Tokenization;
using Dale.Services.DebitCard.Domain.Core.ViewModels.TokenLifeCycle;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TokenLifeCycleController : ControllerBase
    {
        private readonly IMediator _mediator;

        public TokenLifeCycleController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        [Route("UpdateToken")]
        public async Task<ActionResult> UpdateToken([FromBody] TokenLifeCycleRequestBindingModel updateTokenRequestViewModel)
        {
            var response = await _mediator.Send(new TokenLifeCycleCommand()
            {
                updateTokenRequest = updateTokenRequestViewModel
            });

            if (response.Succeeded)
            {
                return Ok(response);
            }

            return StatusCode(StatusCodes.Status500InternalServerError, response.ErrorResult);
        }

        [HttpGet]
        [Route("GetTokenStatus/{userId}")]
        public async Task<ActionResult> GetTokenStatus(string userId)
        {
            var response = await _mediator.Send(new GetTokenStatusQuery()
            {
                UserId = userId
            });

            if (response.Succeeded)
            {
                return Ok(response);
            }

            return StatusCode(StatusCodes.Status500InternalServerError, response.ErrorResult);
        }

    }
}
