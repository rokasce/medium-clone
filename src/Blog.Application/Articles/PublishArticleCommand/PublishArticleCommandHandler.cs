using Blog.Application.Common.Interfaces;
using Blog.Domain.Abstractions;
using Blog.Domain.Articles;
using Blog.Domain.Users;
using MediatR;

namespace Blog.Application.Articles.PublishArticleCommand;

public sealed class PublishArticleCommandHandler
    : IRequestHandler<PublishArticleCommand, Result>
{
    private readonly IArticleRepository _articleRepository;
    private readonly IUserRepository _userRepository;
    private readonly IAuthorRepository _authorRepository;

    public PublishArticleCommandHandler(
        IArticleRepository articleRepository,
        IUserRepository userRepository,
        IAuthorRepository authorRepository)
    {
        _articleRepository = articleRepository;
        _userRepository = userRepository;
        _authorRepository = authorRepository;
    }

    public async Task<Result> Handle(
        PublishArticleCommand request,
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

        var publishResult = article.Publish();

        if (publishResult.IsFailure)
        {
            return publishResult;
        }

        _articleRepository.Update(article);
        await _articleRepository.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}