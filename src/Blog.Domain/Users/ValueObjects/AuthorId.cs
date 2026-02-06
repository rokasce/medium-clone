namespace Blog.Domain.Users.ValueObjects;

public readonly record struct AuthorId
{
    public Guid Value { get; }

    private AuthorId(Guid value) => Value = value;

    public static AuthorId New() => new(Guid.NewGuid());

    public static AuthorId From(Guid value) => new(value);

    public static AuthorId Empty => new(Guid.Empty);

    public static implicit operator Guid(AuthorId id) => id.Value;

    public static explicit operator AuthorId(Guid guid) => new(guid);

    public override string ToString() => Value.ToString();
}
