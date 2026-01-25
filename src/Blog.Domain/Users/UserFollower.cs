using Blog.Domain.Abstractions;

namespace Blog.Domain.Users;

public sealed class UserFollower : Entity
{
    public Guid FollowerId { get; private set; }
    public Guid FollowingId { get; private set; }
    public DateTime FollowedAt { get; private set; }

    // Navigation properties
    public User Follower { get; private set; }
    public User Following { get; private set; }
}