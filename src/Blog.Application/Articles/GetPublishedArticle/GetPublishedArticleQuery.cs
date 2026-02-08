using Blog.Domain.Abstractions;
using MediatR;

namespace Blog.Application.Articles.GetPublishedArticle;

public sealed record GetPublishedArticleQuery(string Slug) : IRequest<Result<PublishedArticleDetailResponse>>;

public sealed record PublishedArticleDetailResponse(
    Guid Id,
    string Title,
    string Slug,
    string Subtitle,
    string Content,
    string? FeaturedImageUrl,
    int ReadingTimeMinutes,
    DateTime PublishedAt,
    int ClapCount,
    PublishedArticleAuthorResponse Author,
    List<PublishedArticleTagResponse> Tags);

public sealed record PublishedArticleAuthorResponse(
    Guid Id,
    string Username,
    string DisplayName,
    string? AvatarUrl);

public sealed record PublishedArticleTagResponse(
    Guid Id,
    string Name,
    string Slug);
