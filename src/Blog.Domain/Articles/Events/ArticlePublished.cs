using Blog.Domain.Abstractions;
using Blog.Domain.Articles.ValueObjects;
using Blog.Domain.Common.ValueObjects;
using Blog.Domain.Users.ValueObjects;

namespace Blog.Domain.Articles.Events;

public sealed record ArticlePublished : DomainEvent
{
    public required Guid ArticleId { get; init; }
    public required AuthorId AuthorId { get; init; }
    public required string Title { get; init; }
    public required Slug Slug { get; init; }
    public required DateTime PublishedAt { get; init; }
    public required IReadOnlyList<TagId> Tags { get; init; }
}
