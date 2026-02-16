using Blog.Application.Common.Interfaces;
using Blog.Domain.Abstractions;
using Blog.Domain.Articles;
using Blog.Domain.Comments;
using Blog.Domain.Users;
using MediatR;

namespace Blog.Application.Comments.AddComment;

internal sealed class AddCommentCommandHandler : IRequestHandler<AddCommentCommand, Result<Guid>>
{
    private readonly ICommentRepository _commentRepository;
    private readonly IArticleRepository _articleRepository;
    private readonly IAuthorRepository _authorRepository;
    private readonly IUserRepository _userRepository;

    public AddCommentCommandHandler(
        ICommentRepository commentRepository,
        IArticleRepository articleRepository,
        IAuthorRepository authorRepository,
        IUserRepository userRepository)
    {
        _commentRepository = commentRepository;
        _articleRepository = articleRepository;
        _authorRepository = authorRepository;
        _userRepository = userRepository;
    }

    public async Task<Result<Guid>> Handle(AddCommentCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdentityIdAsync(request.IdentityId, cancellationToken);
        if (user is null)
        {
            return Result.Failure<Guid>(UserErrors.NotFound);
        }

        var article = await _articleRepository.GetByIdAsync(request.ArticleId, cancellationToken);
        if (article is null)
        {
            return Result.Failure<Guid>(ArticleErrors.NotFound);
        }

        var author = await _authorRepository.GetByUserIdAsync(user.Id, cancellationToken);
        if (author is null)
        {
            return Result.Failure<Guid>(UserErrors.AuthorNotFound);
        }

        Comment comment;

        if (request.ParentCommentId.HasValue)
        {
            var parentComment = await _commentRepository.GetByIdAsync(
                request.ParentCommentId.Value,
                cancellationToken);

            if (parentComment is null)
            {
                return Result.Failure<Guid>(CommentErrors.NotFound);
            }

            // Enforce max 1-level nesting: a reply cannot have a parent that is itself a reply
            if (parentComment.ParentCommentId.HasValue)
            {
                return Result.Failure<Guid>(CommentErrors.NestingTooDeep);
            }

            comment = Comment.CreateReply(article.Id, author.Id, request.Content, parentComment.Id);
        }
        else
        {
            comment = Comment.Create(article.Id, author.Id, request.Content);
        }

        await _commentRepository.AddAsync(comment, cancellationToken);
        await _commentRepository.SaveChangesAsync(cancellationToken);

        return Result.Success(comment.Id);
    }
}
