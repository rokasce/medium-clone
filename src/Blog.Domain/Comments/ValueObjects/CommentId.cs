namespace Blog.Domain.Comments.ValueObjects;

public readonly record struct CommentId
{
    public Guid Value { get; }

    private CommentId(Guid value) => Value = value;

    public static CommentId New() => new(Guid.NewGuid());

    public static CommentId From(Guid value) => new(value);

    public static CommentId Empty => new(Guid.Empty);

    public static implicit operator Guid(CommentId id) => id.Value;

    public static explicit operator CommentId(Guid guid) => new(guid);

    public override string ToString() => Value.ToString();
}
