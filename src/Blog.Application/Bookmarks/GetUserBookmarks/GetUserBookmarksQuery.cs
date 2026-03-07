using Blog.Domain.Abstractions;
using MediatR;

namespace Blog.Application.Bookmarks.GetUserBookmarks;

public sealed record GetUserBookmarksQuery(string IdentityId) : IRequest<Result<List<BookmarkedArticleResponse>>>;

public sealed record BookmarkedArticleResponse(
    Guid ArticleId,
    string Title,
    string Slug,
    string Subtitle,
    string? FeaturedImageUrl,
    int ReadingTimeMinutes,
    DateTime BookmarkedAt,
    BookmarkedAuthorResponse Author);

public sealed record BookmarkedAuthorResponse(
    Guid Id,
    string Username,
    string DisplayName,
    string? AvatarUrl);
