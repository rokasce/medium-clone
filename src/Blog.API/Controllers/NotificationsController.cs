using Blog.Application.Common.Pagination;
using Blog.Application.Notifications.GetNotifications;
using Blog.Application.Notifications.GetUnreadCount;
using Blog.Application.Notifications.MarkAllAsRead;
using Blog.Application.Notifications.MarkAsRead;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Blog.API.Controllers;

[Route("api/notifications")]
[Authorize]
public sealed class NotificationsController : ApiControllerBase
{
    private readonly ISender _sender;

    public NotificationsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<NotificationResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetNotifications(
        [FromQuery] PaginationParams pagination,
        [FromQuery] bool? unreadOnly = null,
        [FromQuery] string? type = null,
        CancellationToken cancellationToken = default)
    {
        var identityId = GetCurrentIdentityId();

        if (identityId is null) return Unauthorized();

        var query = new GetNotificationsQuery(identityId, pagination, unreadOnly, type);
        var result = await _sender.Send(query, cancellationToken);

        if (result.IsFailure)
        {
            return BadRequest(new ErrorResponse(result.Error.Code, result.Error.Message));
        }

        return Ok(result.Value);
    }

    [HttpGet("unread-count")]
    [ProducesResponseType(typeof(UnreadCountResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetUnreadCount(CancellationToken cancellationToken)
    {
        var identityId = GetCurrentIdentityId();

        if (identityId is null) return Unauthorized();

        var query = new GetUnreadCountQuery(identityId);
        var result = await _sender.Send(query, cancellationToken);

        if (result.IsFailure)
        {
            return BadRequest(new ErrorResponse(result.Error.Code, result.Error.Message));
        }

        return Ok(result.Value);
    }

    [HttpPut("{id:guid}/read")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> MarkAsRead(
        Guid id,
        CancellationToken cancellationToken)
    {
        var identityId = GetCurrentIdentityId();

        if (identityId is null) return Unauthorized();

        var command = new MarkAsReadCommand(id, identityId);
        var result = await _sender.Send(command, cancellationToken);

        if (result.IsFailure)
        {
            return result.Error.Code switch
            {
                "Notification.NotFound" => NotFound(new ErrorResponse(result.Error.Code, result.Error.Message)),
                _ => BadRequest(new ErrorResponse(result.Error.Code, result.Error.Message))
            };
        }

        return Ok();
    }

    [HttpPut("read-all")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> MarkAllAsRead(CancellationToken cancellationToken)
    {
        var identityId = GetCurrentIdentityId();

        if (identityId is null) return Unauthorized();

        var command = new MarkAllAsReadCommand(identityId);
        var result = await _sender.Send(command, cancellationToken);

        if (result.IsFailure)
        {
            return BadRequest(new ErrorResponse(result.Error.Code, result.Error.Message));
        }

        return Ok();
    }
}
