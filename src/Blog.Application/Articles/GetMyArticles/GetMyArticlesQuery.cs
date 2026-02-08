using Blog.Domain.Abstractions;
using MediatR;

namespace Blog.Application.Articles.GetMyArticles;

public sealed record GetMyArticlesQuery(string IdentityId) : IRequest<Result<List<ArticleSummaryResponse>>>;

public sealed record ArticleSummaryResponse(
    Guid Id,
    string Title,
    string Slug,
    string Subtitle,
    string Status,
    string? FeaturedImageUrl,
    int ReadingTimeMinutes,
    DateTime CreatedAt,
    DateTime? PublishedAt,
    DateTime? UpdatedAt,
    List<TagSummaryResponse> Tags);

public sealed record TagSummaryResponse(
    Guid Id,
    string Name,
    string Slug);
