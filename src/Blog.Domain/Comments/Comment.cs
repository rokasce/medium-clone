using Blog.Domain.Abstractions;
using Blog.Domain.Articles;
using Blog.Domain.Comments.ValueObjects;
using Blog.Domain.Users;

namespace Blog.Domain.Comments;

public sealed class Comment : Entity
{
    private readonly List<CommentReply> _replies = new();

    public Guid ArticleId { get; private set; }
    public Guid AuthorId { get; private set; }
    public Guid? ParentCommentId { get; private set; }
    public string Content { get; private set; }
    public CommentStatus Status { get; private set; }
    public int LikeCount { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    public DateTime? DeletedAt { get; private set; }

    public IReadOnlyList<CommentReply> Replies => _replies.AsReadOnly();

    // Navigation properties
    public Article Article { get; private set; }
    public Author Author { get; private set; }
    public Comment? ParentComment { get; private set; }
}