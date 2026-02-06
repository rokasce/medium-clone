namespace Blog.Domain.Articles.ValueObjects;

public readonly record struct TagId
{
    public Guid Value { get; }

    private TagId(Guid value) => Value = value;

    public static TagId New() => new(Guid.NewGuid());

    public static TagId From(Guid value) => new(value);

    public static TagId Empty => new(Guid.Empty);

    public static implicit operator Guid(TagId id) => id.Value;

    public static explicit operator TagId(Guid guid) => new(guid);

    public override string ToString() => Value.ToString();
}
