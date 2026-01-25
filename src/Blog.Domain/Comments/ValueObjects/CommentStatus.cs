namespace Blog.Domain.Comments.ValueObjects;

public enum CommentStatus
{
    Active = 0,
    Edited = 1,
    Flagged = 2,
    Spam = 3,
    Deleted = 4
}