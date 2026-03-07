using Blog.Domain.Abstractions;
using Blog.Domain.Articles;
using Blog.Domain.Users;

namespace Blog.Domain.ReadingList;

public sealed class Bookmark : Entity
{
    private Bookmark() { }

    public Guid UserId { get; private set; }
    public Guid ArticleId { get; private set; }
    public DateTime BookmarkedAt { get; private set; }

    // Navigation properties
    public User User { get; private set; } = null!;
    public Article Article { get; private set; } = null!;

    public static Bookmark Create(Guid userId, Guid articleId)
    {
        return new Bookmark
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            ArticleId = articleId,
            BookmarkedAt = DateTime.UtcNow
        };
    }
}