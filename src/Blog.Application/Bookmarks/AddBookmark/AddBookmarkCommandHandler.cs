using Blog.Application.Common.Interfaces;
using Blog.Domain.Abstractions;
using Blog.Domain.Articles;
using Blog.Domain.ReadingList;
using Blog.Domain.Users;
using MediatR;

namespace Blog.Application.Bookmarks.AddBookmark;

internal sealed class AddBookmarkCommandHandler
    : IRequestHandler<AddBookmarkCommand, Result>
{
    private readonly IBookmarkRepository _bookmarkRepository;
    private readonly IArticleRepository _articleRepository;
    private readonly IUserRepository _userRepository;

    public AddBookmarkCommandHandler(
        IBookmarkRepository bookmarkRepository,
        IArticleRepository articleRepository,
        IUserRepository userRepository)
    {
        _bookmarkRepository = bookmarkRepository;
        _articleRepository = articleRepository;
        _userRepository = userRepository;
    }

    public async Task<Result> Handle(
        AddBookmarkCommand request,
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdentityIdAsync(request.IdentityId, cancellationToken);

        if (user is null)
        {
            return Result.Failure(UserErrors.NotFound);
        }

        var article = await _articleRepository.GetByIdAsync(request.ArticleId, cancellationToken);

        if (article is null)
        {
            return Result.Failure(ArticleErrors.NotFound);
        }

        // Check if bookmark already exists
        var existingBookmark = await _bookmarkRepository.GetByUserAndArticleAsync(
            user.Id,
            request.ArticleId,
            cancellationToken);

        if (existingBookmark is not null)
        {
            return Result.Failure(BookmarkErrors.AlreadyBookmarked);
        }

        var bookmark = Bookmark.Create(user.Id, request.ArticleId);

        await _bookmarkRepository.AddAsync(bookmark, cancellationToken);
        await _bookmarkRepository.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
