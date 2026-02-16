using Blog.Application.Common.Interfaces;
using Blog.Domain.Abstractions;
using Blog.Domain.Articles;
using Blog.Domain.Reactions;
using Blog.Domain.Users;
using MediatR;

namespace Blog.Application.Articles.ClapArticle;

internal sealed class ClapArticleCommandHandler
    : IRequestHandler<ClapArticleCommand, Result<ClapArticleResponse>>
{
    private readonly IArticleClapRepository _clapRepository;
    private readonly IArticleRepository _articleRepository;
    private readonly IUserRepository _userRepository;

    public ClapArticleCommandHandler(
        IArticleClapRepository clapRepository,
        IArticleRepository articleRepository,
        IUserRepository userRepository)
    {
        _clapRepository = clapRepository;
        _articleRepository = articleRepository;
        _userRepository = userRepository;
    }

    public async Task<Result<ClapArticleResponse>> Handle(
        ClapArticleCommand request,
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdentityIdAsync(request.IdentityId, cancellationToken);

        if (user is null)
        {
            return Result.Failure<ClapArticleResponse>(UserErrors.NotFound);
        }

        var article = await _articleRepository.GetByIdAsync(request.ArticleId, cancellationToken);

        if (article is null)
        {
            return Result.Failure<ClapArticleResponse>(ArticleErrors.NotFound);
        }

        // Users cannot clap their own articles
        if (article.Author.UserId == user.Id)
        {
            return Result.Failure<ClapArticleResponse>(ArticleErrors.CannotClapOwnArticle);
        }

        var clap = await _clapRepository.GetByArticleAndUserAsync(
            request.ArticleId,
            user.Id,
            cancellationToken);

        var isNew = clap is null;

        if (isNew)
        {
            clap = ArticleClap.Create(request.ArticleId, user.Id);
        }

        var result = clap!.AddClaps(request.ClapCount);

        if (result.IsFailure)
        {
            return Result.Failure<ClapArticleResponse>(result.Error);
        }

        if (isNew)
        {
            await _clapRepository.AddAsync(clap, cancellationToken);
        }

        await _clapRepository.SaveChangesAsync(cancellationToken);

        var totalClaps = await _clapRepository.GetTotalClapsForArticleAsync(
            request.ArticleId,
            cancellationToken);

        return Result.Success(new ClapArticleResponse(
            totalClaps,
            clap.ClapCount,
            clap.RemainingClaps));
    }
}
