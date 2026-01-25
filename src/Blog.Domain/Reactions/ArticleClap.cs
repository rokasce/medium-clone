using Blog.Domain.Abstractions;
using Blog.Domain.Articles;
using Blog.Domain.Users;

namespace Blog.Domain.Reactions;

public sealed class ArticleClap : Entity
{
    public Guid ArticleId { get; private set; }
    public Guid UserId { get; private set; }
    public int ClapCount { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime LastClappedAt { get; private set; }

    // Navigation properties
    public Article Article { get; private set; }
    public User User { get; private set; }

    private const int MaxClapsPerUser = 50;

    public void AddClaps(int count)
    {
        if (ClapCount + count > MaxClapsPerUser)
        {
            throw new InvalidOperationException(
                $"Cannot exceed {MaxClapsPerUser} claps per article");
        }

        ClapCount += count;
        LastClappedAt = DateTime.UtcNow;

        // AddDomainEvent(new ArticleClapAdded
        // {
        //     ArticleId = ArticleId,
        //     UserId = UserId,
        //     ClapsAdded = count,
        //     TotalClaps = ClapCount
        // });
    }
}