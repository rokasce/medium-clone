using Blog.Application.Common.Interfaces;
using Blog.Application.Common.Pagination;
using Blog.Domain.Abstractions;
using MediatR;

namespace Blog.Application.Articles.GetPublishedArticles;

internal sealed class GetPublishedArticlesQueryHandler
    : IRequestHandler<GetPublishedArticlesQuery, Result<PagedResult<PublishedArticleResponse>>>
{
    private readonly IArticleRepository _articleRepository;

    public GetPublishedArticlesQueryHandler(IArticleRepository articleRepository)
    {
        _articleRepository = articleRepository;
    }

    public async Task<Result<PagedResult<PublishedArticleResponse>>> Handle(
        GetPublishedArticlesQuery request,
        CancellationToken cancellationToken)
    {
        var pagination = request.Pagination;

        var (articles, totalCount) = await _articleRepository.GetPublishedArticlesPagedAsync(
            pagination.GetPage(),
            pagination.GetPageSize(),
            request.SearchTerm,
            request.TagId,
            request.SortBy,
            cancellationToken);

        var items = articles.Select(a => new PublishedArticleResponse(
            a.Id,
            a.Title,
            a.Slug,
            a.Subtitle,
            a.FeaturedImageUrl.HasValue ? a.FeaturedImageUrl.Value.Value : null,
            a.ReadingTimeMinutes,
            a.PublishedAt!.Value,
            new AuthorSummaryResponse(
                a.Author.Id,
                a.Author.User.Username,
                a.Author.User.DisplayName,
                a.Author.User.AvatarUrl.HasValue ? a.Author.User.AvatarUrl.Value.Value : null)))
            .ToList();

        var result = new PagedResult<PublishedArticleResponse>
        {
            Items = items,
            Page = pagination.GetPage(),
            PageSize = pagination.GetPageSize(),
            TotalCount = totalCount
        };

        return Result.Success(result);
    }
}
