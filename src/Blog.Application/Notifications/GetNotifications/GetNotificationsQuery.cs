using Blog.Application.Common.Pagination;
using Blog.Domain.Abstractions;
using MediatR;

namespace Blog.Application.Notifications.GetNotifications;

public sealed record GetNotificationsQuery(
    string IdentityId,
    PaginationParams Pagination,
    bool? UnreadOnly = null,
    string? TypeFilter = null) : IRequest<Result<PagedResult<NotificationResponse>>>;

public sealed record NotificationResponse(
    Guid Id,
    string Type,
    string Title,
    string Message,
    string? ActionUrl,
    Guid? RelatedEntityId,
    Guid? ActorId,
    string? ActorName,
    string? ActorAvatarUrl,
    bool IsRead,
    DateTime CreatedAt,
    DateTime? ReadAt);
