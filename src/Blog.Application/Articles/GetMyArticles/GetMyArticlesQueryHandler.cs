using Blog.Application.Common.Interfaces;
using Blog.Domain.Abstractions;
using Blog.Domain.Users;
using MediatR;

namespace Blog.Application.Articles.GetMyArticles;

internal sealed class GetMyArticlesQueryHandler
    : IRequestHandler<GetMyArticlesQuery, Result<List<ArticleSummaryResponse>>>
{
    private readonly IArticleRepository _articleRepository;
    private readonly IUserRepository _userRepository;
    private readonly IAuthorRepository _authorRepository;
    private readonly IArticleClapRepository _clapRepository;

    public GetMyArticlesQueryHandler(
        IArticleRepository articleRepository,
        IUserRepository userRepository,
        IAuthorRepository authorRepository,
        IArticleClapRepository clapRepository)
    {
        _articleRepository = articleRepository;
        _userRepository = userRepository;
        _authorRepository = authorRepository;
        _clapRepository = clapRepository;
    }

    public async Task<Result<List<ArticleSummaryResponse>>> Handle(
        GetMyArticlesQuery request,
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdentityIdAsync(request.IdentityId, cancellationToken);

        if (user is null)
        {
            return Result.Failure<List<ArticleSummaryResponse>>(UserErrors.NotFound);
        }

        var author = await _authorRepository.GetByUserIdAsync(user.Id, cancellationToken);

        if (author is null)
        {
            // User is not an author yet, return empty list
            return Result.Success(new List<ArticleSummaryResponse>());
        }

        var articles = await _articleRepository.GetByAuthorIdAsync(author.Id, cancellationToken);

        var articleIds = articles.Select(a => a.Id).ToList();
        var clapCounts = await _clapRepository.GetTotalClapsForArticlesAsync(articleIds, cancellationToken);

        var response = articles
            .OrderByDescending(a => a.UpdatedAt ?? a.CreatedAt)
            .Select(a => new ArticleSummaryResponse(
                a.Id,
                a.Title,
                a.Slug,
                a.Subtitle,
                a.Status.ToString(),
                a.FeaturedImageUrl.HasValue ? a.FeaturedImageUrl.Value.Value : null,
                a.ReadingTimeMinutes,
                a.CreatedAt,
                a.PublishedAt,
                a.UpdatedAt,
                clapCounts.GetValueOrDefault(a.Id, 0),
                a.Tags.Select(t => new TagSummaryResponse(t.Tag.Id, t.Tag.Name, t.Tag.Slug)).ToList()))
            .ToList();

        return Result.Success(response);
    }
}
