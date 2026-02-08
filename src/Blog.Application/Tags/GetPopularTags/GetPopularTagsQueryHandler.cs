using Blog.Application.Common.Interfaces;
using Blog.Application.Common.Pagination;
using Blog.Domain.Abstractions;
using MediatR;

namespace Blog.Application.Tags.GetPopularTags;

internal sealed class GetPopularTagsQueryHandler
    : IRequestHandler<GetPopularTagsQuery, Result<PagedResult<PopularTagResponse>>>
{
    private readonly ITagRepository _tagRepository;

    public GetPopularTagsQueryHandler(ITagRepository tagRepository)
    {
        _tagRepository = tagRepository;
    }

    public async Task<Result<PagedResult<PopularTagResponse>>> Handle(
        GetPopularTagsQuery request,
        CancellationToken cancellationToken)
    {
        var pagination = request.Pagination;

        var (tags, totalCount) = await _tagRepository.GetPopularTagsAsync(
            pagination.GetPage(),
            pagination.GetPageSize(),
            cancellationToken);

        var items = tags
            .Select(t => new PopularTagResponse(t.Id, t.Name, t.Slug, t.ArticleCount))
            .ToList();

        var result = new PagedResult<PopularTagResponse>
        {
            Items = items,
            Page = pagination.GetPage(),
            PageSize = pagination.GetPageSize(),
            TotalCount = totalCount
        };

        return Result.Success(result);
    }
}
