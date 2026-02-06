using Blog.Domain.Abstractions;
using MediatR;

namespace Blog.Application.Users.GetCurrentUser;

public sealed record GetCurrentUserQuery(string IdentityId) : IRequest<Result<UserResponse>>;

public sealed record UserResponse(
    Guid Id,
    string Email,
    string Username,
    string DisplayName,
    string? Bio,
    string? AvatarUrl,
    bool IsVerified);
