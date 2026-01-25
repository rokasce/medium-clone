using Blog.Domain.Abstractions;

namespace Blog.Domain.Articles;

public sealed class ArticleTag : Entity
{
    private ArticleTag() { } // EF Core

    internal ArticleTag(Guid articleId, Guid tagId)
    {
        ArticleId = articleId;
        TagId = tagId;
        AddedAt = DateTime.UtcNow;
    }

    public Guid ArticleId { get; private set; }
    public Guid TagId { get; private set; }
    public DateTime AddedAt { get; private set; }

    // Navigation properties
    public Article Article { get; private set; } = null!;
    public Tag Tag { get; private set; } = null!;
}