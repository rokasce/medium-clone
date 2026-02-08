using Blog.Application.Articles.CreateArticleDraft;
using Blog.Application.Articles.DeleteArticle;
using Blog.Application.Articles.GetArticleBySlug;
using Blog.Application.Articles.GetMyArticles;
using Blog.Application.Articles.GetPublishedArticle;
using Blog.Application.Articles.GetPublishedArticles;
using Blog.Application.Articles.PublishArticleCommand;
using Blog.Application.Articles.UnpublishArticle;
using Blog.Application.Articles.UpdateArticle;
using Blog.Application.Common.Pagination;
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

    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<PublishedArticleResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPublishedArticles(
        [FromQuery] PaginationParams pagination,
        [FromQuery] string? search = null,
        [FromQuery] Guid? tagId = null,
        [FromQuery] string? sortBy = null,
        CancellationToken cancellationToken = default)
    {
        var query = new GetPublishedArticlesQuery(pagination, search, tagId, sortBy);
        var result = await _sender.Send(query, cancellationToken);

        if (result.IsFailure)
        {
            return BadRequest(new ErrorResponse(result.Error.Code, result.Error.Message));
        }

        return Ok(result.Value);
    }

    [HttpGet("{slug}")]
    [ProducesResponseType(typeof(PublishedArticleDetailResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetPublishedArticle(
        string slug,
        CancellationToken cancellationToken)
    {
        var query = new GetPublishedArticleQuery(slug);
        var result = await _sender.Send(query, cancellationToken);

        if (result.IsFailure)
        {
            return NotFound(new ErrorResponse(result.Error.Code, result.Error.Message));
        }

        return Ok(result.Value);
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
            Content = request.Content,
            FeaturedImageUrl = request.FeaturedImageUrl
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

    [Authorize]
    [HttpPost("{id:guid}/unpublish")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Unpublish(
        Guid id,
        CancellationToken cancellationToken)
    {
        var identityId = GetCurrentIdentityId();

        if (identityId is null) return Unauthorized();

        var command = new UnpublishArticleCommand
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
                "Article.NotPublished" => BadRequest(new ErrorResponse(result.Error.Code, result.Error.Message)),
                _ => BadRequest(new ErrorResponse(result.Error.Code, result.Error.Message))
            };
        }

        return Ok();
    }

    [Authorize]
    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdateArticleRequest request,
        CancellationToken cancellationToken)
    {
        var identityId = GetCurrentIdentityId();

        if (identityId is null) return Unauthorized();

        var command = new UpdateArticleCommand
        {
            ArticleId = id,
            IdentityId = identityId,
            Title = request.Title,
            Subtitle = request.Subtitle,
            Content = request.Content,
            FeaturedImageUrl = request.FeaturedImageUrl,
            Tags = request.Tags
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

    [Authorize]
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(
        Guid id,
        CancellationToken cancellationToken)
    {
        var identityId = GetCurrentIdentityId();

        if (identityId is null) return Unauthorized();

        var command = new DeleteArticleCommand
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

        return NoContent();
    }
}

// DTOs
public sealed record CreateArticleDraftRequest(
    string Title,
    string Subtitle,
    string Content,
    string? FeaturedImageUrl);

public sealed record UpdateArticleRequest(
    string Title,
    string Subtitle,
    string Content,
    string? FeaturedImageUrl,
    List<string> Tags);

public sealed record CreateArticleResponse(Guid Id, string Slug);

public sealed record ErrorResponse(string Code, string Message);