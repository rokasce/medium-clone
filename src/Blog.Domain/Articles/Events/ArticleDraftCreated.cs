using Blog.Domain.Abstractions;

namespace Blog.Domain.Articles.Events;

public sealed record ArticleDraftCreated : DomainEvent
{
    public required Guid ArticleId { get; init; }
    public required Guid AuthorId { get; init; }
    public required string Title { get; init; }
}
