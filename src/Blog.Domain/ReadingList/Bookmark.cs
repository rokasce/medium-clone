using Blog.Domain.Abstractions;
using Blog.Domain.Articles;
using Blog.Domain.Users;

namespace Blog.Domain.ReadingList;

public sealed class Bookmark : Entity
{
    public Guid UserId { get; private set; }
    public Guid ArticleId { get; private set; }
    public DateTime BookmarkedAt { get; private set; }

    // Navigation properties
    public User User { get; private set; }
    public Article Article { get; private set; }
}