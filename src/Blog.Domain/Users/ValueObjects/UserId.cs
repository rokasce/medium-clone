namespace Blog.Domain.Users.ValueObjects;

public readonly record struct UserId
{
    public Guid Value { get; }

    private UserId(Guid value) => Value = value;

    public static UserId New() => new(Guid.NewGuid());

    public static UserId From(Guid value) => new(value);

    public static UserId Empty => new(Guid.Empty);

    public static implicit operator Guid(UserId id) => id.Value;

    public static explicit operator UserId(Guid guid) => new(guid);

    public override string ToString() => Value.ToString();
}
