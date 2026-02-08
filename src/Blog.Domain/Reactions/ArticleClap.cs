using Blog.Domain.Abstractions;
using Blog.Domain.Articles;
using Blog.Domain.Reactions.Events;
using Blog.Domain.Users;

namespace Blog.Domain.Reactions;

public sealed class ArticleClap : Entity
{
    private ArticleClap() { } // EF Core

    private ArticleClap(Guid articleId, Guid userId)
    {
        Id = Guid.NewGuid();
        ArticleId = articleId;
        UserId = userId;
        ClapCount = 0;
        CreatedAt = DateTime.UtcNow;
        LastClappedAt = DateTime.UtcNow;
    }

    public Guid ArticleId { get; private set; }
    public Guid UserId { get; private set; }
    public int ClapCount { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime LastClappedAt { get; private set; }

    // Navigation properties
    public Article Article { get; private set; } = null!;
    public User User { get; private set; } = null!;

    public const int MaxClapsPerUser = 50;

    public static ArticleClap Create(Guid articleId, Guid userId)
    {
        return new ArticleClap(articleId, userId);
    }

    public Result AddClaps(int count)
    {
        if (count <= 0)
        {
            return Result.Failure(ArticleClapErrors.InvalidClapCount);
        }

        if (ClapCount + count > MaxClapsPerUser)
        {
            var remaining = MaxClapsPerUser - ClapCount;
            if (remaining <= 0)
            {
                return Result.Failure(ArticleClapErrors.MaxClapsReached);
            }

            count = remaining;
        }

        ClapCount += count;
        LastClappedAt = DateTime.UtcNow;

        AddDomainEvent(new ArticleClapAdded
        {
            ArticleId = ArticleId,
            UserId = UserId,
            ClapsAdded = count,
            TotalClaps = ClapCount
        });

        return Result.Success();
    }

    public int RemainingClaps => MaxClapsPerUser - ClapCount;
}

public static class ArticleClapErrors
{
    public static readonly Error InvalidClapCount = Error.Failure(
        "ArticleClap.InvalidClapCount",
        "Clap count must be greater than zero.");

    public static readonly Error MaxClapsReached = Error.Failure(
        "ArticleClap.MaxClapsReached",
        $"Maximum of {ArticleClap.MaxClapsPerUser} claps per article has been reached.");
}