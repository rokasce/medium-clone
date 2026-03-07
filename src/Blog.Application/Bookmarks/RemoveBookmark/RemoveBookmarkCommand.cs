using Blog.Domain.Abstractions;
using MediatR;

namespace Blog.Application.Bookmarks.RemoveBookmark;

public sealed record RemoveBookmarkCommand : IRequest<Result>
{
    public required Guid ArticleId { get; init; }
    public required string IdentityId { get; init; }
}
