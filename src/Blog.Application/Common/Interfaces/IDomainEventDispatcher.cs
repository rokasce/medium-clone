using Blog.Domain.Abstractions;

namespace Blog.Application.Common.Interfaces;

public interface IDomainEventDispatcher
{
    Task DispatchEventsAsync(
        IEnumerable<IHasDomainEvents> entities,
        CancellationToken cancellationToken = default);
}