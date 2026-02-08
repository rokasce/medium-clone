using Blog.Application.Common.Pagination;
using Blog.Application.Tags.GetPopularTags;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Blog.API.Controllers;

[Route("api/tags")]
public sealed class TagsController : ApiControllerBase
{
    private readonly ISender _sender;

    public TagsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet("popular")]
    [ProducesResponseType(typeof(PagedResult<PopularTagResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPopularTags(
        [FromQuery] PaginationParams pagination,
        CancellationToken cancellationToken)
    {
        var query = new GetPopularTagsQuery(pagination);
        var result = await _sender.Send(query, cancellationToken);

        return Ok(result.Value);
    }
}
