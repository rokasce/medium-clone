using Blog.Application.Common.Interfaces;
using Blog.Domain.Abstractions;
using Blog.Domain.Users;
using MediatR;

namespace Blog.Application.Notifications.GetUnreadCount;

internal sealed class GetUnreadCountQueryHandler
    : IRequestHandler<GetUnreadCountQuery, Result<UnreadCountResponse>>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IUserRepository _userRepository;

    public GetUnreadCountQueryHandler(
        INotificationRepository notificationRepository,
        IUserRepository userRepository)
    {
        _notificationRepository = notificationRepository;
        _userRepository = userRepository;
    }

    public async Task<Result<UnreadCountResponse>> Handle(
        GetUnreadCountQuery request,
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdentityIdAsync(request.IdentityId, cancellationToken);

        if (user is null)
        {
            return Result.Failure<UnreadCountResponse>(UserErrors.NotFound);
        }

        var count = await _notificationRepository.GetUnreadCountAsync(user.Id, cancellationToken);

        return Result.Success(new UnreadCountResponse(count));
    }
}
