using Blog.Domain.Abstractions;

namespace Blog.Domain.Articles;

public sealed class Tag : Entity
{
    private Tag() { } // EF Core

    private Tag(Guid id, string name, string slug)
    {
        Id = id;
        Name = name;
        Slug = slug;
        ArticleCount = 0;
    }

    private readonly List<ArticleTag> _articles = new();

    public new Guid Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string Slug { get; private set; } = string.Empty;
    public int ArticleCount { get; private set; }

    public IReadOnlyList<ArticleTag> Articles => _articles.AsReadOnly();

    public static Tag Create(string name, string slug)
    {
        return new Tag(Guid.NewGuid(), name, slug);
    }

    public void IncrementArticleCount()
    {
        ArticleCount++;
    }

    public void DecrementArticleCount()
    {
        if (ArticleCount > 0)
        {
            ArticleCount--;
        }
    }
}