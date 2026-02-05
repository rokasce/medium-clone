using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace Blog.API.Controllers;

[ApiController]
public abstract class ApiControllerBase : ControllerBase
{
    protected string? GetCurrentIdentityId()
    {
        var identityId = User.FindFirstValue("sub")
            ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

        return string.IsNullOrEmpty(identityId) ? null : identityId;
    }
}
