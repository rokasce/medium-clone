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

    public GetMyArticlesQueryHandler(
        IArticleRepository articleRepository,
        IUserRepository userRepository,
        IAuthorRepository authorRepository)
    {
        _articleRepository = articleRepository;
        _userRepository = userRepository;
        _authorRepository = authorRepository;
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
                a.Tags.Select(t => new TagSummaryResponse(t.Tag.Id, t.Tag.Name, t.Tag.Slug)).ToList()))
            .ToList();

        return Result.Success(response);
    }
}
