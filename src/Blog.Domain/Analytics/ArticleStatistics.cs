using Blog.Domain.Abstractions;
using Blog.Domain.Articles;

namespace Blog.Domain.Analytics;

public sealed class ArticleStatistics : Entity
{
    private ArticleStatistics() { } // EF Core

    private ArticleStatistics(Guid articleId)
    {
        Id = Guid.NewGuid();
        ArticleId = articleId;
        LastUpdatedAt = DateTime.UtcNow;
    }

    public Guid ArticleId { get; private set; }
    public int ViewCount { get; private set; }
    public int UniqueViewCount { get; private set; }
    public int ClapCount { get; private set; }
    public int CommentCount { get; private set; }
    public DateTime LastUpdatedAt { get; private set; }

    public static ArticleStatistics Create(Guid articleId)
    {
        return new ArticleStatistics(articleId);
    }

    public void IncrementViews()
    {
        ViewCount++;
        LastUpdatedAt = DateTime.UtcNow;
    }

    public void IncrementUniqueViews()
    {
        UniqueViewCount++;
        LastUpdatedAt = DateTime.UtcNow;
    }

    public void IncrementClaps(int count)
    {
        ClapCount += count;
        LastUpdatedAt = DateTime.UtcNow;
    }

    public void IncrementComments()
    {
        CommentCount++;
        LastUpdatedAt = DateTime.UtcNow;
    }

    public void DecrementComments()
    {
        if (CommentCount > 0)
        {
            CommentCount--;
            LastUpdatedAt = DateTime.UtcNow;
        }
    }
}