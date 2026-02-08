using Blog.Domain.Abstractions;

namespace Blog.Domain.Reactions.Events;

public sealed record ArticleClapAdded : DomainEvent
{
    public required Guid ArticleId { get; init; }
    public required Guid UserId { get; init; }
    public required int ClapsAdded { get; init; }
    public required int TotalClaps { get; init; }
}
