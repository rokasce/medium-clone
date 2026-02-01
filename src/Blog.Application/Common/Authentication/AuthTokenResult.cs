namespace Blog.Application.Common.Authentication;

public sealed record AuthTokenResult(string AccessToken, string RefreshToken, int ExpiresIn);
