namespace Blog.Domain.Publications.ValueObjects;

public readonly record struct PublicationId
{
    public Guid Value { get; }

    private PublicationId(Guid value) => Value = value;

    public static PublicationId New() => new(Guid.NewGuid());

    public static PublicationId From(Guid value) => new(value);

    public static PublicationId Empty => new(Guid.Empty);

    public static implicit operator Guid(PublicationId id) => id.Value;

    public static explicit operator PublicationId(Guid guid) => new(guid);

    public override string ToString() => Value.ToString();
}
