namespace Blog.Application.Users.RefreshToken;

public sealed record RefreshTokenResponse(string AccessToken, string RefreshToken, int ExpiresIn);
