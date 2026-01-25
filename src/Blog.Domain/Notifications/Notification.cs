
using Blog.Domain.Abstractions;
using Blog.Domain.Notifications.ValueObjects;
using Blog.Domain.Users;

namespace Blog.Domain.Notifications;

public sealed class Notification : Entity
{
    public Guid UserId { get; private set; }
    public NotificationType Type { get; private set; }
    public string Title { get; private set; }
    public string Message { get; private set; }
    public string? ActionUrl { get; private set; }
    public Guid? RelatedEntityId { get; private set; }
    public bool IsRead { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? ReadAt { get; private set; }

    // Navigation properties
    public User User { get; private set; }

    public void MarkAsRead()
    {
        if (IsRead) return;

        IsRead = true;
        ReadAt = DateTime.UtcNow;

        // AddDomainEvent(new NotificationRead
        // {
        //     NotificationId = Id,
        //     UserId = UserId
        // });
    }
}