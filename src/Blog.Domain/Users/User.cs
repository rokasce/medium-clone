using System.ComponentModel.DataAnnotations.Schema;
using Blog.Domain.Abstractions;

namespace Blog.Domain.Users;

public sealed class User : Entity
{
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

    [NotMapped]
    public IReadOnlyList<UserFollower> Followers => _followers.AsReadOnly();
    [NotMapped]
    public IReadOnlyList<UserFollower> Following => _following.AsReadOnly();
}