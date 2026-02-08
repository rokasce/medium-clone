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

        var clap = await _clapRepository.GetByArticleAndUserAsync(
            request.ArticleId,
            user.Id,
            cancellationToken);

        if (clap is null)
        {
            clap = ArticleClap.Create(request.ArticleId, user.Id);
            await _clapRepository.AddAsync(clap, cancellationToken);
        }

        var result = clap.AddClaps(request.ClapCount);

        if (result.IsFailure)
        {
            return Result.Failure<ClapArticleResponse>(result.Error);
        }

        _clapRepository.Update(clap);
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
