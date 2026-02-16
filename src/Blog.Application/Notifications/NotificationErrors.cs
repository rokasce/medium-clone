using Blog.Domain.Abstractions;

namespace Blog.Application.Notifications;

public static class NotificationErrors
{
    public static readonly Error NotFound = Error.Failure(
        "Notification.NotFound",
        "The notification was not found.");
}
