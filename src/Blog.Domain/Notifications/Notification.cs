using Blog.Domain.Abstractions;
using Blog.Domain.Notifications.ValueObjects;
using Blog.Domain.Users;

namespace Blog.Domain.Notifications;

public sealed class Notification : Entity
{
    private Notification(
        Guid id,
        Guid userId,
        NotificationType type,
        string title,
        string message,
        string? actionUrl,
        Guid? relatedEntityId,
        Guid? actorId,
        string? actorName,
        string? actorAvatarUrl)
        : base(id)
    {
        UserId = userId;
        Type = type;
        Title = title;
        Message = message;
        ActionUrl = actionUrl;
        RelatedEntityId = relatedEntityId;
        ActorId = actorId;
        ActorName = actorName;
        ActorAvatarUrl = actorAvatarUrl;
        IsRead = false;
        CreatedAt = DateTime.UtcNow;
    }

    private Notification() { }

    public Guid UserId { get; private set; }
    public NotificationType Type { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string Message { get; private set; } = string.Empty;
    public string? ActionUrl { get; private set; }
    public Guid? RelatedEntityId { get; private set; }
    public Guid? ActorId { get; private set; }
    public string? ActorName { get; private set; }
    public string? ActorAvatarUrl { get; private set; }
    public bool IsRead { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? ReadAt { get; private set; }

    // Navigation properties
    public User User { get; private set; } = null!;

    public static Notification Create(
        Guid userId,
        NotificationType type,
        string title,
        string message,
        string? actionUrl = null,
        Guid? relatedEntityId = null,
        Guid? actorId = null,
        string? actorName = null,
        string? actorAvatarUrl = null)
    {
        return new Notification(
            Guid.NewGuid(),
            userId,
            type,
            title,
            message,
            actionUrl,
            relatedEntityId,
            actorId,
            actorName,
            actorAvatarUrl);
    }

    public void MarkAsRead()
    {
        if (IsRead) return;

        IsRead = true;
        ReadAt = DateTime.UtcNow;
    }
}
