using Blog.Domain.Abstractions;

namespace Blog.Domain.Articles.Events;

public sealed record ArticleTagsUpdated : DomainEvent
{
    public required Guid ArticleId { get; init; }
    public required IReadOnlyList<Guid> TagIds { get; init; }
}
