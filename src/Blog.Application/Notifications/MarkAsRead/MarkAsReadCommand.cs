using Blog.Domain.Abstractions;
using MediatR;

namespace Blog.Application.Notifications.MarkAsRead;

public sealed record MarkAsReadCommand(
    Guid NotificationId,
    string IdentityId) : IRequest<Result>;
