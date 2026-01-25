using Blog.Domain.Abstractions;

namespace Blog.Domain.Comments;

public sealed class CommentReply : Entity
{
    public Guid ParentCommentId { get; private set; }
    public Guid ChildCommentId { get; private set; }

    // Navigation properties
    public Comment ParentComment { get; private set; }
    public Comment ChildComment { get; private set; }
}