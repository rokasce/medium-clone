using Blog.Domain.Abstractions;
using MediatR;

namespace Blog.Application.Articles.GetArticleBySlug;

public sealed record GetArticleBySlugQuery(string Slug, string IdentityId) : IRequest<Result<ArticleResponse>>;

public sealed record ArticleResponse(
    Guid Id,
    string Title,
    string Slug,
    string Subtitle,
    string Content,
    string? FeaturedImageUrl,
    int ReadingTimeMinutes,
    DateTime CreatedAt,
    DateTime? PublishedAt,
    int ClapCount,
    AuthorResponse Author,
    List<TagResponse> Tags);

public sealed record AuthorResponse(
    Guid Id,
    string Username,
    string DisplayName,
    string? AvatarUrl);

public sealed record TagResponse(
    Guid Id,
    string Name,
    string Slug);
