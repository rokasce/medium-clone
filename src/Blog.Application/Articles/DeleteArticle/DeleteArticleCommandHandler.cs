using Blog.Application.Common.Interfaces;
using Blog.Domain.Abstractions;
using Blog.Domain.Articles;
using Blog.Domain.Users;
using MediatR;

namespace Blog.Application.Articles.DeleteArticle;

internal sealed class DeleteArticleCommandHandler
    : IRequestHandler<DeleteArticleCommand, Result>
{
    private readonly IArticleRepository _articleRepository;
    private readonly IUserRepository _userRepository;
    private readonly IAuthorRepository _authorRepository;

    public DeleteArticleCommandHandler(
        IArticleRepository articleRepository,
        IUserRepository userRepository,
        IAuthorRepository authorRepository)
    {
        _articleRepository = articleRepository;
        _userRepository = userRepository;
        _authorRepository = authorRepository;
    }

    public async Task<Result> Handle(
        DeleteArticleCommand request,
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdentityIdAsync(request.IdentityId, cancellationToken);

        if (user is null)
        {
            return Result.Failure(UserErrors.NotFound);
        }

        var author = await _authorRepository.GetByUserIdAsync(user.Id, cancellationToken);

        if (author is null)
        {
            return Result.Failure(ArticleErrors.Unauthorized);
        }

        var article = await _articleRepository.GetByIdAsync(request.ArticleId, cancellationToken);

        if (article is null)
        {
            return Result.Failure(ArticleErrors.NotFound);
        }

        if (article.AuthorId != author.Id)
        {
            return Result.Failure(ArticleErrors.Unauthorized);
        }

        article.Delete();

        _articleRepository.Update(article);
        await _articleRepository.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
