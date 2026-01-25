using Blog.Domain.Abstractions;
using Blog.Domain.Comments;
using Blog.Domain.Users;

namespace Blog.Domain.Reactions;

public sealed class CommentLike : Entity
{
    public Guid CommentId { get; private set; }
    public Guid UserId { get; private set; }
    public DateTime CreatedAt { get; private set; }

    // Navigation properties
    public Comment Comment { get; private set; }
    public User User { get; private set; }
}