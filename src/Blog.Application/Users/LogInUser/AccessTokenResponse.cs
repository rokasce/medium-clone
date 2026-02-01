namespace Blog.Application.Users.LogInUser;

public sealed record AccessTokenResponse(
    string AccessToken,
    string RefreshToken,
    int ExpiresIn,
    UserResponse User);

public sealed record UserResponse(
    Guid Id,
    string Email,
    string Username,
    string DisplayName,
    string? Bio,
    string? AvatarUrl,
    bool IsVerified);