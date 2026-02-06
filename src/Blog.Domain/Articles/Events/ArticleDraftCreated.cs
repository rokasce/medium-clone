using Blog.Domain.Abstractions;
using Blog.Domain.Users.ValueObjects;

namespace Blog.Domain.Articles.Events;

public sealed record ArticleDraftCreated : DomainEvent
{
    public required Guid ArticleId { get; init; }
    public required AuthorId AuthorId { get; init; }
    public required string Title { get; init; }
}
