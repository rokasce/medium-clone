using Blog.Domain.Abstractions;
using Blog.Domain.Articles;

namespace Blog.Domain.Users;

public sealed class Author : Entity
{
    private readonly List<Article> _articles = new();
    private readonly List<AuthorBadge> _badges = new();

    private Author(Guid id, Guid userId) : base(id)
    {
        UserId = userId;
        FollowerCount = 0;
        ArticleCount = 0;
        TotalViews = 0;
        TotalClaps = 0;
    }

    private Author() { }

    public Guid UserId { get; private set; }
    public int FollowerCount { get; private set; }
    public int ArticleCount { get; private set; }
    public int TotalViews { get; private set; }
    public int TotalClaps { get; private set; }

    public IReadOnlyList<Article> Articles => _articles.AsReadOnly();
    public IReadOnlyList<AuthorBadge> Badges => _badges.AsReadOnly();

    // Navigation properties
    public User User { get; private set; } = null!;

    public static Author Create(Guid userId)
    {
        return new Author(Guid.NewGuid(), userId);
    }

    public void IncrementArticleCount()
    {
        ArticleCount++;
    }

    public void DecrementArticleCount()
    {
        if (ArticleCount > 0)
            ArticleCount--;
    }
}