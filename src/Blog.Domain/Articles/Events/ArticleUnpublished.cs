using Blog.Domain.Abstractions;

namespace Blog.Domain.Articles.Events;

public sealed record ArticleUnpublished : DomainEvent
{
    public required Guid ArticleId { get; init; }
    public required DateTime UnpublishedAt { get; init; }
}
