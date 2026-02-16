using Blog.Domain.Abstractions;
using MediatR;

namespace Blog.Application.Notifications.MarkAllAsRead;

public sealed record MarkAllAsReadCommand(string IdentityId) : IRequest<Result>;
