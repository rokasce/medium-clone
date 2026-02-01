using Blog.Domain.Abstractions;

namespace Blog.Application.Common.Authentication;

public interface IJwtService
{
    Task<Result<AuthTokenResult>> GetAccessTokenAsync(
        string email,
        string password,
        CancellationToken cancellationToken = default);

    Task<Result<AuthTokenResult>> RefreshTokenAsync(
        string refreshToken,
        CancellationToken cancellationToken = default);
}