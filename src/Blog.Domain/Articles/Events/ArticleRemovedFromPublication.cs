using Blog.Domain.Abstractions;
using Blog.Domain.Publications.ValueObjects;

namespace Blog.Domain.Articles.Events;

public sealed record ArticleRemovedFromPublication : DomainEvent
{
    public required Guid ArticleId { get; init; }
    public required PublicationId PublicationId { get; init; }
}
