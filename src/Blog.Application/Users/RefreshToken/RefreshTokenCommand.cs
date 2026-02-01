using Blog.Domain.Abstractions;
using MediatR;

namespace Blog.Application.Users.RefreshToken;

public sealed record RefreshTokenCommand(string RefreshToken) : IRequest<Result<RefreshTokenResponse>>;
