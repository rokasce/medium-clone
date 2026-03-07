using Blog.Application.Bookmarks.AddBookmark;
using Blog.Application.Bookmarks.GetUserBookmarks;
using Blog.Application.Bookmarks.RemoveBookmark;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Blog.API.Controllers;

[Route("api/bookmarks")]
[Authorize]
public sealed class BookmarksController : ApiControllerBase
{
    private readonly ISender _sender;

    public BookmarksController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    [ProducesResponseType(typeof(List<BookmarkedArticleResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetUserBookmarks(CancellationToken cancellationToken)
    {
        var identityId = GetCurrentIdentityId();

        if (identityId is null) return Unauthorized();

        var query = new GetUserBookmarksQuery(identityId);
        var result = await _sender.Send(query, cancellationToken);

        if (result.IsFailure)
        {
            return NotFound(new ErrorResponse(result.Error.Code, result.Error.Message));
        }

        return Ok(result.Value);
    }

    [HttpPost("{articleId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> AddBookmark(
        Guid articleId,
        CancellationToken cancellationToken)
    {
        var identityId = GetCurrentIdentityId();

        if (identityId is null) return Unauthorized();

        var command = new AddBookmarkCommand
        {
            ArticleId = articleId,
            IdentityId = identityId
        };

        var result = await _sender.Send(command, cancellationToken);

        if (result.IsFailure)
        {
            return result.Error.Code switch
            {
                "Article.NotFound" => NotFound(new ErrorResponse(result.Error.Code, result.Error.Message)),
                "User.NotFound" => NotFound(new ErrorResponse(result.Error.Code, result.Error.Message)),
                "Bookmark.AlreadyBookmarked" => Conflict(new ErrorResponse(result.Error.Code, result.Error.Message)),
                _ => BadRequest(new ErrorResponse(result.Error.Code, result.Error.Message))
            };
        }

        return Ok();
    }

    [HttpDelete("{articleId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RemoveBookmark(
        Guid articleId,
        CancellationToken cancellationToken)
    {
        var identityId = GetCurrentIdentityId();

        if (identityId is null) return Unauthorized();

        var command = new RemoveBookmarkCommand
        {
            ArticleId = articleId,
            IdentityId = identityId
        };

        var result = await _sender.Send(command, cancellationToken);

        if (result.IsFailure)
        {
            return result.Error.Code switch
            {
                "Bookmark.NotFound" => NotFound(new ErrorResponse(result.Error.Code, result.Error.Message)),
                "User.NotFound" => NotFound(new ErrorResponse(result.Error.Code, result.Error.Message)),
                _ => BadRequest(new ErrorResponse(result.Error.Code, result.Error.Message))
            };
        }

        return Ok();
    }
}
