using Blog.Domain.Abstractions;

namespace Blog.Domain.Articles.Events;

public sealed record ArticleSubmittedToPublication : DomainEvent
{
    public required Guid ArticleId { get; init; }
    public required Guid PublicationId { get; init; }
    public required DateTime SubmittedAt { get; init; }
}
