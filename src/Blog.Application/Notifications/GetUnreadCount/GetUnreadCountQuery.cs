using Blog.Domain.Abstractions;
using MediatR;

namespace Blog.Application.Notifications.GetUnreadCount;

public sealed record GetUnreadCountQuery(string IdentityId) : IRequest<Result<UnreadCountResponse>>;

public sealed record UnreadCountResponse(int Count);
