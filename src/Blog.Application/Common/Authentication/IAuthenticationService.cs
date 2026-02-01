using System;
using Blog.Domain.Users;

namespace Blog.Application.Common.Authentication;

public interface IAuthenticationService
{
    Task<string> RegisterAsync(
        User user,
        string password,
        CancellationToken cancellationToken = default);
}