using Blog.Application.Common.Pagination;
using Blog.Domain.Abstractions;
using MediatR;

namespace Blog.Application.Tags.GetPopularTags;

public sealed record GetPopularTagsQuery(PaginationParams Pagination) : IRequest<Result<PagedResult<PopularTagResponse>>>;

public sealed record PopularTagResponse(
    Guid Id,
    string Name,
    string Slug,
    int ArticleCount);
