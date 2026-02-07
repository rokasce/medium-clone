using Blog.Application.Articles.CreateArticleDraft;
using Blog.Application.Articles.GetArticleBySlug;
using Blog.Application.Articles.GetMyArticles;
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
    [HttpGet("my")]
    [ProducesResponseType(typeof(List<ArticleSummaryResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetMyArticles(CancellationToken cancellationToken)
    {
        var identityId = GetCurrentIdentityId();

        if (identityId is null) return Unauthorized();

        var query = new GetMyArticlesQuery(identityId);
        var result = await _sender.Send(query, cancellationToken);

        if (result.IsFailure)
        {
            return BadRequest(new ErrorResponse(result.Error.Code, result.Error.Message));
        }

        return Ok(result.Value);
    }

    [Authorize]
    [HttpGet("preview/{slug}")]
    [ProducesResponseType(typeof(ArticleResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetBySlug(
        string slug,
        CancellationToken cancellationToken)
    {
        var identityId = GetCurrentIdentityId();

        if (identityId is null) return Unauthorized();

        var query = new GetArticleBySlugQuery(slug, identityId);
        var result = await _sender.Send(query, cancellationToken);

        if (result.IsFailure)
        {
            return result.Error.Code switch
            {
                "Article.NotFound" => NotFound(new ErrorResponse(result.Error.Code, result.Error.Message)),
                "Article.Unauthorized" => Forbid(),
                _ => BadRequest(new ErrorResponse(result.Error.Code, result.Error.Message))
            };
        }

        return Ok(result.Value);
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
        var identityId = GetCurrentIdentityId();

        if (identityId is null) return Unauthorized();

        var command = new CreateArticleDraftCommand
        {
            IdentityId = identityId,
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

        return Ok(new CreateArticleResponse(result.Value.Id, result.Value.Slug));
    }

    [Authorize]
    [HttpPost("{id:guid}/publish")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Publish(
        Guid id,
        CancellationToken cancellationToken)
    {
        var identityId = GetCurrentIdentityId();

        if (identityId is null) return Unauthorized();

        var command = new PublishArticleCommand
        {
            ArticleId = id,
            IdentityId = identityId
        };

        var result = await _sender.Send(command, cancellationToken);

        if (result.IsFailure)
        {
            return result.Error.Code switch
            {
                "Article.NotFound" => NotFound(new ErrorResponse(result.Error.Code, result.Error.Message)),
                "Article.Unauthorized" => Forbid(),
                _ => BadRequest(new ErrorResponse(result.Error.Code, result.Error.Message))
            };
        }

        return Ok();
    }
}

// DTOs
public sealed record CreateArticleDraftRequest(
    string Title,
    string Subtitle,
    string Content);

public sealed record CreateArticleResponse(Guid Id, string Slug);

public sealed record ErrorResponse(string Code, string Message);