namespace Blog.Domain.Notifications.ValueObjects;

public enum NotificationType
{
    NewFollower = 0,
    ArticleClapped = 1,
    ArticleCommented = 2,
    CommentReplied = 3,
    ArticlePublished = 4,
    MentionedInComment = 5,
    SubmissionApproved = 6,
    SubmissionRejected = 7
}