using Blog.Application.Common.Interfaces;
using Blog.Domain.Abstractions;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Blog.Infrastructure.Persistance;

public sealed class DomainEventDispatcher : IDomainEventDispatcher
{
    private readonly IPublisher _publisher;
    private readonly ILogger<DomainEventDispatcher> _logger;

    public DomainEventDispatcher(
        IPublisher publisher,
        ILogger<DomainEventDispatcher> logger)
    {
        _publisher = publisher;
        _logger = logger;
    }

    public async Task DispatchEventsAsync(
        IEnumerable<IHasDomainEvents> entities,
        CancellationToken cancellationToken = default)
    {
        var domainEvents = entities
            .SelectMany(e => e.DomainEvents)
            .ToList();

        ClearEvents(entities);

        await PublishEventsAsync(domainEvents, cancellationToken);
    }

    private void ClearEvents(IEnumerable<IHasDomainEvents> entities)
    {
        foreach (var entity in entities)
        {
            entity.ClearDomainEvents();
        }
    }

    private async Task PublishEventsAsync(
        IReadOnlyList<IDomainEvent> events,
        CancellationToken cancellationToken)
    {
        foreach (var domainEvent in events)
        {
            _logger.LogInformation(
                "Publishing domain event: {EventType}",
                domainEvent.GetType().Name);

            await _publisher.Publish(domainEvent, cancellationToken);
        }
    }
}