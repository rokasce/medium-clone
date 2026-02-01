using System.ComponentModel.DataAnnotations.Schema;
using Blog.Domain.Abstractions;

namespace Blog.Domain.Users;

public sealed class User : Entity
{
    private User(Guid id, string email, string username)
        : base(id)
    {
        Email = email;
        Username = username;
        CreatedAt = DateTime.UtcNow;
        DisplayName = username;
        IsVerified = true;
    }
    private readonly List<UserFollower> _followers = new();
    private readonly List<UserFollower> _following = new();

    public string Email { get; private set; }
    public string Username { get; private set; }
    public string DisplayName { get; private set; }
    public string? Bio { get; private set; }
    public string? AvatarUrl { get; private set; }
    public bool IsVerified { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? LastActiveAt { get; private set; }
    public string IdentityId { get; private set; } = string.Empty;

    public static User Create(string email, string username)
    {
        var user = new User(Guid.NewGuid(), email, username);

        // user.RaiseDomainEvent(new UserCreatedDomainEvent(user.Id));

        return user;
    }

    public void SetIdentityId(string identityId)
    {
        IdentityId = identityId;
    }

    [NotMapped]
    public IReadOnlyList<UserFollower> Followers => _followers.AsReadOnly();
    [NotMapped]
    public IReadOnlyList<UserFollower> Following => _following.AsReadOnly();
}