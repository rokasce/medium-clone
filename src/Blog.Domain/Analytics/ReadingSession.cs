using Blog.Domain.Abstractions;
using Blog.Domain.Articles;
using Blog.Domain.Users;

namespace Blog.Domain.Analytics;

public sealed class ReadingSession : Entity
{
    public Guid ArticleId { get; private set; }
    public Guid? UserId { get; private set; }
    public DateTime StartedAt { get; private set; }
    public DateTime? CompletedAt { get; private set; }
    public int ReadingProgressPercentage { get; private set; }
    public int TimeSpentSeconds { get; private set; }

    // Navigation properties
    public Article Article { get; private set; }
    public User? User { get; private set; }
}
