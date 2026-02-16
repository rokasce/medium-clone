using Blog.Application.Common.Interfaces;
using Blog.Domain.Abstractions;
using Blog.Domain.Comments;
using Blog.Domain.Users;
using MediatR;

namespace Blog.Application.Comments.DeleteComment;

internal sealed class DeleteCommentCommandHandler : IRequestHandler<DeleteCommentCommand, Result>
{
    private readonly ICommentRepository _commentRepository;
    private readonly IUserRepository _userRepository;
    private readonly IAuthorRepository _authorRepository;

    public DeleteCommentCommandHandler(
        ICommentRepository commentRepository,
        IUserRepository userRepository,
        IAuthorRepository authorRepository)
    {
        _commentRepository = commentRepository;
        _userRepository = userRepository;
        _authorRepository = authorRepository;
    }

    public async Task<Result> Handle(DeleteCommentCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdentityIdAsync(request.IdentityId, cancellationToken);
        if (user is null)
        {
            return Result.Failure(UserErrors.NotFound);
        }

        var comment = await _commentRepository.GetByIdAsync(request.CommentId, cancellationToken);
        if (comment is null)
        {
            return Result.Failure(CommentErrors.NotFound);
        }

        var author = await _authorRepository.GetByUserIdAsync(user.Id, cancellationToken);

        // Only the comment author can delete their comment
        if (author is null || comment.AuthorId != author.Id)
        {
            return Result.Failure(CommentErrors.Unauthorized);
        }

        var result = comment.Delete();
        if (result.IsFailure)
        {
            return result;
        }

        await _commentRepository.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
