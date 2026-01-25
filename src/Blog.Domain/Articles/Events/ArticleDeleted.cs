using Blog.Domain.Abstractions;

namespace Blog.Domain.Articles.Events;

public sealed record ArticleDeleted : DomainEvent
{
    public required Guid ArticleId { get; init; }
    public required DateTime DeletedAt { get; init; }
}
