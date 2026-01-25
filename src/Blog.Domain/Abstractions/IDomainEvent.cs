using MediatR;

namespace Blog.Domain.Abstractions;

public interface IDomainEvent : INotification
{
    Guid EventId { get; }
    DateTime OccurredAt { get; }
}