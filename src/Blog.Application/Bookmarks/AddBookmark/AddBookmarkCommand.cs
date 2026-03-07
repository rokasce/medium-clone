using Blog.Domain.Abstractions;
using MediatR;

namespace Blog.Application.Bookmarks.AddBookmark;

public sealed record AddBookmarkCommand : IRequest<Result>
{
    public required Guid ArticleId { get; init; }
    public required string IdentityId { get; init; }
}
