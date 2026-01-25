using Blog.Domain.Abstractions;

namespace Blog.Domain.Articles.Events;

public sealed record ArticleReadingTimeCalculated : DomainEvent
{
    public required Guid ArticleId { get; init; }
    public required int ReadingTimeMinutes { get; init; }
}
