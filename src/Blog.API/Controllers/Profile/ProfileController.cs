using Blog.Application.Users.GetCurrentUser;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Blog.API.Controllers.Profile;

[Route("api/profile")]
public sealed class ProfileController : ApiControllerBase
{
    private readonly ISender _sender;

    public ProfileController(ISender sender)
    {
        _sender = sender;
    }

    [Authorize]
    [HttpGet("me")]
    [ProducesResponseType(typeof(UserResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCurrentUser(CancellationToken cancellationToken)
    {
        var identityId = GetCurrentIdentityId();

        if (identityId is null)
        {
            return Unauthorized();
        }

        var query = new GetCurrentUserQuery(identityId);
        var result = await _sender.Send(query, cancellationToken);

        if (result.IsFailure)
        {
            return NotFound(new ErrorResponse(result.Error.Code, result.Error.Message));
        }

        return Ok(result.Value);
    }
}

public sealed record ErrorResponse(string Code, string Message);
