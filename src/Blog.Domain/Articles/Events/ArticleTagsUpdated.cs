using Blog.Domain.Abstractions;
using Blog.Domain.Articles.ValueObjects;

namespace Blog.Domain.Articles.Events;

public sealed record ArticleTagsUpdated : DomainEvent
{
    public required Guid ArticleId { get; init; }
    public required IReadOnlyList<TagId> TagIds { get; init; }
}
