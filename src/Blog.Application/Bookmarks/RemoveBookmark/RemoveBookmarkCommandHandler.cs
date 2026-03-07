using Blog.Application.Common.Interfaces;
using Blog.Domain.Abstractions;
using Blog.Domain.Users;
using MediatR;

namespace Blog.Application.Bookmarks.RemoveBookmark;

internal sealed class RemoveBookmarkCommandHandler
    : IRequestHandler<RemoveBookmarkCommand, Result>
{
    private readonly IBookmarkRepository _bookmarkRepository;
    private readonly IUserRepository _userRepository;

    public RemoveBookmarkCommandHandler(
        IBookmarkRepository bookmarkRepository,
        IUserRepository userRepository)
    {
        _bookmarkRepository = bookmarkRepository;
        _userRepository = userRepository;
    }

    public async Task<Result> Handle(
        RemoveBookmarkCommand request,
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdentityIdAsync(request.IdentityId, cancellationToken);

        if (user is null)
        {
            return Result.Failure(UserErrors.NotFound);
        }

        var bookmark = await _bookmarkRepository.GetByUserAndArticleAsync(
            user.Id,
            request.ArticleId,
            cancellationToken);

        if (bookmark is null)
        {
            return Result.Failure(BookmarkErrors.NotFound);
        }

        _bookmarkRepository.Delete(bookmark);
        await _bookmarkRepository.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
