using Blog.Application.Common.Interfaces;
using Blog.Domain.Abstractions;
using Blog.Domain.Users;
using MediatR;

namespace Blog.Application.Users.GetCurrentUser;

internal sealed class GetCurrentUserQueryHandler
    : IRequestHandler<GetCurrentUserQuery, Result<UserResponse>>
{
    private readonly IUserRepository _userRepository;

    public GetCurrentUserQueryHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<Result<UserResponse>> Handle(
        GetCurrentUserQuery request,
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdentityIdAsync(
            request.IdentityId,
            cancellationToken);

        if (user is null)
        {
            return Result.Failure<UserResponse>(UserErrors.NotFound);
        }

        var response = new UserResponse(
            user.Id,
            user.Email,
            user.Username,
            user.DisplayName,
            user.Bio,
            user.AvatarUrl.HasValue ? user.AvatarUrl.Value.Value : null,
            user.IsVerified);

        return Result.Success(response);
    }
}
