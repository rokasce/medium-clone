using Blog.Application.Common.Pagination;
using Blog.Domain.Abstractions;
using MediatR;

namespace Blog.Application.Articles.GetPublishedArticles;

public sealed record GetPublishedArticlesQuery(
    PaginationParams Pagination,
    string? SearchTerm,
    Guid? TagId,
    string? SortBy) : IRequest<Result<PagedResult<PublishedArticleResponse>>>;

public sealed record PublishedArticleResponse(
    Guid Id,
    string Title,
    string Slug,
    string Subtitle,
    string? FeaturedImageUrl,
    int ReadingTimeMinutes,
    DateTime PublishedAt,
    AuthorSummaryResponse Author);

public sealed record AuthorSummaryResponse(
    Guid Id,
    string Username,
    string DisplayName,
    string? AvatarUrl);
