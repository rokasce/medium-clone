using Blog.Application.Articles.CreateArticleDraft;
using Blog.Application.Articles.PublishArticleCommand;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Blog.API.Controllers;

[Route("api/articles")]
public sealed class ArticlesController : ApiControllerBase
{
    private readonly ISender _sender;

    public ArticlesController(ISender sender)
    {
        _sender = sender;
    }

    [Authorize]
    [HttpPost("drafts")]
    [ProducesResponseType(typeof(CreateArticleResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> CreateDraft(
        [FromBody] CreateArticleDraftRequest request,
        CancellationToken cancellationToken)
    {
        var authorId = GetCurrentUserId();

        if (authorId is null) return Unauthorized();

        var command = new CreateArticleDraftCommand
        {
            AuthorId = authorId.Value,
            Title = request.Title,
            Subtitle = request.Subtitle,
            Content = request.Content
        };

        var result = await _sender.Send(command, cancellationToken);

        if (result.IsFailure)
        {
            return BadRequest(new ErrorResponse(
                result.Error.Code,
                result.Error.Message));
        }

        return Ok(new CreateArticleResponse(result.Value));
    }

    [HttpPost("{id:guid}/publish")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Publish(
        Guid id,
        CancellationToken cancellationToken)
    {
        var command = new PublishArticleCommand { ArticleId = id };

        var result = await _sender.Send(command, cancellationToken);

        if (result.IsFailure)
        {
            // Return 404 for NotFound, 400 for other errors
            return result.Error.Code == "Article.NotFound"
                ? NotFound(new ErrorResponse(result.Error.Code, result.Error.Message))
                : BadRequest(new ErrorResponse(result.Error.Code, result.Error.Message));
        }

        return Ok();
    }
}

// DTOs
public sealed record CreateArticleDraftRequest(
    string Title,
    string Subtitle,
    string Content);

public sealed record CreateArticleResponse(Guid ArticleId);

public sealed record ErrorResponse(string Code, string Message);