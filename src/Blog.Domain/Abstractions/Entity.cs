namespace Blog.Domain.Abstractions;

public abstract class Entity : IHasDomainEvents
{
    protected Entity(Guid id)
    {
        Id = id;
    }

    protected Entity()
    {
    }

    private readonly List<IDomainEvent> _domainEvents = new();

    public Guid Id { get; init; }

    public IReadOnlyList<IDomainEvent> DomainEvents => _domainEvents.AsReadOnly();

    public void AddDomainEvent(IDomainEvent domainEvent)
    {
        _domainEvents.Add(domainEvent);
    }

    public void ClearDomainEvents()
    {
        _domainEvents.Clear();
    }
}