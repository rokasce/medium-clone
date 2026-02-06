namespace Blog.Domain.Articles.ValueObjects;

public readonly record struct ArticleId
{
    public Guid Value { get; }

    private ArticleId(Guid value) => Value = value;

    public static ArticleId New() => new(Guid.NewGuid());

    public static ArticleId From(Guid value) => new(value);

    public static ArticleId Empty => new(Guid.Empty);

    public static implicit operator Guid(ArticleId id) => id.Value;

    public static explicit operator ArticleId(Guid guid) => new(guid);

    public override string ToString() => Value.ToString();
}
