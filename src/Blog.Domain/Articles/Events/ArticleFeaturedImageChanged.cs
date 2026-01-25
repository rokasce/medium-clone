using Blog.Domain.Abstractions;

namespace Blog.Domain.Articles.Events;

public sealed record ArticleFeaturedImageChanged : DomainEvent
{
    public required Guid ArticleId { get; init; }
    public required string ImageUrl { get; init; }
}
