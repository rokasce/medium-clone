using Blog.Domain.Notifications;

namespace Blog.Application.Common.Interfaces;

public interface INotificationRepository : IRepository<Notification>
{
    Task<(List<Notification> Notifications, int TotalCount)> GetByUserIdPagedAsync(
        Guid userId,
        int page,
        int pageSize,
        bool? unreadOnly,
        string? typeFilter,
        CancellationToken cancellationToken);

    Task<int> GetUnreadCountAsync(Guid userId, CancellationToken cancellationToken);

    Task<Notification?> GetByIdAndUserIdAsync(
        Guid notificationId,
        Guid userId,
        CancellationToken cancellationToken);

    Task MarkAllAsReadAsync(Guid userId, CancellationToken cancellationToken);
}
