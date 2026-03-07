using Blog.Application.Common.Interfaces;
using Blog.Domain.Abstractions;
using Blog.Domain.Articles.ValueObjects;
using Blog.Domain.Users;
using MediatR;

namespace Blog.Application.Bookmarks.GetUserBookmarks;

internal sealed class GetUserBookmarksQueryHandler
    : IRequestHandler<GetUserBookmarksQuery, Result<List<BookmarkedArticleResponse>>>
{
    private readonly IBookmarkRepository _bookmarkRepository;
    private readonly IUserRepository _userRepository;

    public GetUserBookmarksQueryHandler(
        IBookmarkRepository bookmarkRepository,
        IUserRepository userRepository)
    {
        _bookmarkRepository = bookmarkRepository;
        _userRepository = userRepository;
    }

    public async Task<Result<List<BookmarkedArticleResponse>>> Handle(
        GetUserBookmarksQuery request,
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdentityIdAsync(request.IdentityId, cancellationToken);

        if (user is null)
        {
            return Result.Failure<List<BookmarkedArticleResponse>>(UserErrors.NotFound);
        }

        var bookmarks = await _bookmarkRepository.GetByUserIdAsync(user.Id, cancellationToken);

        var items = bookmarks
            .Where(b => b.Article.Status == ArticleStatus.Published)
            .Select(b => new BookmarkedArticleResponse(
                b.ArticleId,
                b.Article.Title,
                b.Article.Slug,
                b.Article.Subtitle,
                b.Article.FeaturedImageUrl.HasValue ? b.Article.FeaturedImageUrl.Value.Value : null,
                b.Article.ReadingTimeMinutes,
                b.BookmarkedAt,
                new BookmarkedAuthorResponse(
                    b.Article.Author.Id,
                    b.Article.Author.User.Username,
                    b.Article.Author.User.DisplayName,
                    b.Article.Author.User.AvatarUrl.HasValue ? b.Article.Author.User.AvatarUrl.Value.Value : null)))
            .ToList();

        return Result.Success(items);
    }
}
