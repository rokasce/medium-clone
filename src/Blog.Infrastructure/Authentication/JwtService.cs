using System.Net.Http.Json;
using Blog.Application.Common.Authentication;
using Blog.Domain.Abstractions;
using Blog.Infrastructure.Authentication.Models;
using Microsoft.Extensions.Options;

namespace Blog.Infrastructure.Authentication;

internal sealed class JwtService : IJwtService
{
    private static readonly Error AuthenticationFailed = Error.Failure(
        "Keycloak.AuthenticationFailed",
        "Failed to acquire access token due to authentication failure");

    private static readonly Error RefreshFailed = Error.Failure(
        "Keycloak.RefreshFailed",
        "Failed to refresh access token");

    private readonly HttpClient _httpClient;
    private readonly KeycloakOptions _keycloakOptions;

    public JwtService(HttpClient httpClient, IOptions<KeycloakOptions> keycloakOptions)
    {
        _httpClient = httpClient;
        _keycloakOptions = keycloakOptions.Value;
    }

    public async Task<Result<AuthTokenResult>> GetAccessTokenAsync(
        string email,
        string password,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var authRequestParameters = new KeyValuePair<string, string>[]
            {
                new("client_id", _keycloakOptions.AuthClientId),
                new("client_secret", _keycloakOptions.AuthClientSecret),
                new("scope", "openid email offline_access"),
                new("grant_type", "password"),
                new("username", email),
                new("password", password)
            };

            var authorizationRequestContent = new FormUrlEncodedContent(authRequestParameters);

            var response = await _httpClient.PostAsync("", authorizationRequestContent, cancellationToken);

            response.EnsureSuccessStatusCode();

            var authorizationToken = await response.Content.ReadFromJsonAsync<AuthorizationToken>(cancellationToken);

            if (authorizationToken is null)
            {
                return Result.Failure<AuthTokenResult>(AuthenticationFailed);
            }

            return new AuthTokenResult(
                authorizationToken.AccessToken,
                authorizationToken.RefreshToken,
                authorizationToken.ExpiresIn);
        }
        catch (HttpRequestException)
        {
            return Result.Failure<AuthTokenResult>(AuthenticationFailed);
        }
    }

    public async Task<Result<AuthTokenResult>> RefreshTokenAsync(
        string refreshToken,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var authRequestParameters = new KeyValuePair<string, string>[]
            {
                new("client_id", _keycloakOptions.AuthClientId),
                new("client_secret", _keycloakOptions.AuthClientSecret),
                new("grant_type", "refresh_token"),
                new("refresh_token", refreshToken)
            };

            var authorizationRequestContent = new FormUrlEncodedContent(authRequestParameters);

            var response = await _httpClient.PostAsync("", authorizationRequestContent, cancellationToken);

            response.EnsureSuccessStatusCode();

            var authorizationToken = await response.Content.ReadFromJsonAsync<AuthorizationToken>(cancellationToken);

            if (authorizationToken is null)
            {
                return Result.Failure<AuthTokenResult>(RefreshFailed);
            }

            return new AuthTokenResult(
                authorizationToken.AccessToken,
                authorizationToken.RefreshToken,
                authorizationToken.ExpiresIn);
        }
        catch (HttpRequestException)
        {
            return Result.Failure<AuthTokenResult>(RefreshFailed);
        }
    }
}