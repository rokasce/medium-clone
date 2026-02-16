using Blog.Domain.Abstractions;
using Blog.Domain.Articles;
using Blog.Domain.Comments.ValueObjects;
using Blog.Domain.Users;

namespace Blog.Domain.Comments;

public sealed class Comment : Entity
{
    private readonly List<CommentReply> _replies = new();

    private Comment(Guid id, Guid articleId, Guid authorId, string content, Guid? parentCommentId)
        : base(id)
    {
        ArticleId = articleId;
        AuthorId = authorId;
        Content = content;
        ParentCommentId = parentCommentId;
        Status = CommentStatus.Active;
        LikeCount = 0;
        CreatedAt = DateTime.UtcNow;
    }

    private Comment() { }

    public Guid ArticleId { get; private set; }
    public Guid AuthorId { get; private set; }
    public Guid? ParentCommentId { get; private set; }
    public string Content { get; private set; } = string.Empty;
    public CommentStatus Status { get; private set; }
    public int LikeCount { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    public DateTime? DeletedAt { get; private set; }

    public IReadOnlyList<CommentReply> Replies => _replies.AsReadOnly();

    // Navigation properties
    public Article Article { get; private set; } = null!;
    public Author Author { get; private set; } = null!;
    public Comment? ParentComment { get; private set; }

    public static Comment Create(Guid articleId, Guid authorId, string content)
    {
        return new Comment(Guid.NewGuid(), articleId, authorId, content, null);
    }

    public static Comment CreateReply(Guid articleId, Guid authorId, string content, Guid parentCommentId)
    {
        return new Comment(Guid.NewGuid(), articleId, authorId, content, parentCommentId);
    }

    public Result Edit(string newContent)
    {
        if (Status == CommentStatus.Deleted)
        {
            return Result.Failure(CommentErrors.AlreadyDeleted);
        }

        Content = newContent;
        Status = CommentStatus.Edited;
        UpdatedAt = DateTime.UtcNow;

        return Result.Success();
    }

    public Result Delete()
    {
        if (Status == CommentStatus.Deleted)
        {
            return Result.Failure(CommentErrors.AlreadyDeleted);
        }

        Status = CommentStatus.Deleted;
        DeletedAt = DateTime.UtcNow;

        return Result.Success();
    }
}

public static class CommentErrors
{
    public static readonly Error NotFound = Error.Failure(
        "Comment.NotFound",
        "The comment was not found.");

    public static readonly Error AlreadyDeleted = Error.Failure(
        "Comment.AlreadyDeleted",
        "The comment has already been deleted.");

    public static readonly Error Unauthorized = Error.Failure(
        "Comment.Unauthorized",
        "You are not authorized to modify this comment.");

    public static readonly Error NestingTooDeep = Error.Failure(
        "Comment.NestingTooDeep",
        "Comments can only be nested one level deep.");
}
