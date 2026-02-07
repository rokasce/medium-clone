using Blog.Domain.Abstractions;
using Blog.Domain.Common.ValueObjects;

namespace Blog.Domain.Articles.Events;

public sealed record ArticlePublished : DomainEvent
{
    public required Guid ArticleId { get; init; }
    public required Guid AuthorId { get; init; }
    public required string Title { get; init; }
    public required Slug Slug { get; init; }
    public required DateTime PublishedAt { get; init; }
    public required IReadOnlyList<Guid> Tags { get; init; }
}
