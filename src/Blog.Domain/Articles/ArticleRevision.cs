using Blog.Domain.Abstractions;

namespace Blog.Domain.Articles;

public sealed class ArticleRevision : Entity
{
    private ArticleRevision() { } // EF Core

    internal ArticleRevision(
        Guid articleId,
        string title,
        string content,
        int version)
    {
        Id = Guid.NewGuid();
        ArticleId = articleId;
        Title = title;
        Content = content;
        Version = version;
        CreatedAt = DateTime.UtcNow;
    }

    public Guid ArticleId { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string Content { get; private set; } = string.Empty;
    public int Version { get; private set; }
    public DateTime CreatedAt { get; private set; }

    // Navigation property
    public Article Article { get; private set; } = null!;
}