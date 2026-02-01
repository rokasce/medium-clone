using Blog.Application.Common.Authentication;
using Blog.Application.Common.Interfaces;
using Blog.Domain.Abstractions;
using Blog.Domain.Users;
using MediatR;

namespace Blog.Application.Users.LogInUser;

internal sealed class LogInUserCommandHandler : IRequestHandler<LogInUserCommand, Result<AccessTokenResponse>>
{
    private readonly IJwtService _jwtService;
    private readonly IUserRepository _userRepository;

    public LogInUserCommandHandler(IJwtService jwtService, IUserRepository userRepository)
    {
        _jwtService = jwtService;
        _userRepository = userRepository;
    }

    public async Task<Result<AccessTokenResponse>> Handle(
        LogInUserCommand request,
        CancellationToken cancellationToken)
    {
        var result = await _jwtService.GetAccessTokenAsync(
            request.Email,
            request.Password,
            cancellationToken);

        if (result.IsFailure)
        {
            return Result.Failure<AccessTokenResponse>(UserErrors.InvalidCredentials);
        }

        var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);

        if (user is null)
        {
            return Result.Failure<AccessTokenResponse>(UserErrors.NotFound);
        }

        var userResponse = new UserResponse(
            user.Id,
            user.Email,
            user.Username,
            user.DisplayName,
            user.Bio,
            user.AvatarUrl,
            user.IsVerified);

        return new AccessTokenResponse(
            result.Value.AccessToken,
            result.Value.RefreshToken,
            result.Value.ExpiresIn,
            userResponse);
    }
}