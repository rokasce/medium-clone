using Blog.Application.Common.Interfaces;
using Blog.Domain.Abstractions;
using Blog.Domain.Articles;
using Blog.Domain.Reactions;
using MediatR;

namespace Blog.Application.Articles.GetArticleClaps;

internal sealed class GetArticleClapsQueryHandler
    : IRequestHandler<GetArticleClapsQuery, Result<ArticleClapsResponse>>
{
    private readonly IArticleClapRepository _clapRepository;
    private readonly IArticleRepository _articleRepository;
    private readonly IUserRepository _userRepository;

    public GetArticleClapsQueryHandler(
        IArticleClapRepository clapRepository,
        IArticleRepository articleRepository,
        IUserRepository userRepository)
    {
        _clapRepository = clapRepository;
        _articleRepository = articleRepository;
        _userRepository = userRepository;
    }

    public async Task<Result<ArticleClapsResponse>> Handle(
        GetArticleClapsQuery request,
        CancellationToken cancellationToken)
    {
        var articleExists = await _articleRepository.ExistsAsync(request.ArticleId, cancellationToken);

        if (!articleExists)
        {
            return Result.Failure<ArticleClapsResponse>(ArticleErrors.NotFound);
        }

        var totalClaps = await _clapRepository.GetTotalClapsForArticleAsync(
            request.ArticleId,
            cancellationToken);

        var userClaps = 0;
        var remainingClaps = ArticleClap.MaxClapsPerUser;

        if (!string.IsNullOrEmpty(request.IdentityId))
        {
            var user = await _userRepository.GetByIdentityIdAsync(request.IdentityId, cancellationToken);

            if (user is not null)
            {
                userClaps = await _clapRepository.GetUserClapsForArticleAsync(
                    request.ArticleId,
                    user.Id,
                    cancellationToken);

                remainingClaps = ArticleClap.MaxClapsPerUser - userClaps;
            }
        }

        return Result.Success(new ArticleClapsResponse(
            totalClaps,
            userClaps,
            remainingClaps));
    }
}
