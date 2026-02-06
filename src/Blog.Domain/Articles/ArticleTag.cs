using Blog.Domain.Abstractions;
using Blog.Domain.Articles.ValueObjects;

namespace Blog.Domain.Articles;

public sealed class ArticleTag : Entity
{
    private ArticleTag() { } // EF Core

    internal ArticleTag(Guid articleId, TagId tagId)
    {
        ArticleId = articleId;
        TagId = tagId;
        AddedAt = DateTime.UtcNow;
    }

    public Guid ArticleId { get; private set; }
    public TagId TagId { get; private set; }
    public DateTime AddedAt { get; private set; }

    // Navigation properties
    public Article Article { get; private set; } = null!;
    public Tag Tag { get; private set; } = null!;
}
