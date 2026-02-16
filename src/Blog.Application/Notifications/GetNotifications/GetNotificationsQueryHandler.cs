using Blog.Application.Common.Interfaces;
using Blog.Application.Common.Pagination;
using Blog.Domain.Abstractions;
using Blog.Domain.Users;
using MediatR;

namespace Blog.Application.Notifications.GetNotifications;

internal sealed class GetNotificationsQueryHandler
    : IRequestHandler<GetNotificationsQuery, Result<PagedResult<NotificationResponse>>>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IUserRepository _userRepository;

    public GetNotificationsQueryHandler(
        INotificationRepository notificationRepository,
        IUserRepository userRepository)
    {
        _notificationRepository = notificationRepository;
        _userRepository = userRepository;
    }

    public async Task<Result<PagedResult<NotificationResponse>>> Handle(
        GetNotificationsQuery request,
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdentityIdAsync(request.IdentityId, cancellationToken);

        if (user is null)
        {
            return Result.Failure<PagedResult<NotificationResponse>>(UserErrors.NotFound);
        }

        var pagination = request.Pagination;

        var (notifications, totalCount) = await _notificationRepository.GetByUserIdPagedAsync(
            user.Id,
            pagination.GetPage(),
            pagination.GetPageSize(),
            request.UnreadOnly,
            request.TypeFilter,
            cancellationToken);

        var items = notifications.Select(n => new NotificationResponse(
            n.Id,
            n.Type.ToString(),
            n.Title,
            n.Message,
            n.ActionUrl,
            n.RelatedEntityId,
            n.ActorId,
            n.ActorName,
            n.ActorAvatarUrl,
            n.IsRead,
            n.CreatedAt,
            n.ReadAt))
            .ToList();

        var result = new PagedResult<NotificationResponse>
        {
            Items = items,
            Page = pagination.GetPage(),
            PageSize = pagination.GetPageSize(),
            TotalCount = totalCount
        };

        return Result.Success(result);
    }
}
