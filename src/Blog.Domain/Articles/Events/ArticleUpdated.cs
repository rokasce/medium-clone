using Blog.Domain.Abstractions;

namespace Blog.Domain.Articles.Events;

public sealed record ArticleUpdated : DomainEvent
{
    public required Guid ArticleId { get; init; }
    public required string Title { get; init; }
}
