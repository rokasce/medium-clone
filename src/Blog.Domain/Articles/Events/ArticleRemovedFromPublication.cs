using Blog.Domain.Abstractions;

namespace Blog.Domain.Articles.Events;

public sealed record ArticleRemovedFromPublication : DomainEvent
{
    public required Guid ArticleId { get; init; }
    public required Guid PublicationId { get; init; }
}
