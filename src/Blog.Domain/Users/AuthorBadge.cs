using Blog.Domain.Abstractions;
using Blog.Domain.Users.ValueObjects;

namespace Blog.Domain.Users;

public sealed class AuthorBadge : Entity
{
    public Guid AuthorId { get; private set; }
    public BadgeType Type { get; private set; }
    public string Name { get; private set; }
    public string Description { get; private set; }
    public string IconUrl { get; private set; }
    public DateTime AwardedAt { get; private set; }

    // Navigation properties
    public Author Author { get; private set; }
}