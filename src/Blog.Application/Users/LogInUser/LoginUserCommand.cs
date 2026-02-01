using Blog.Domain.Abstractions;
using MediatR;

namespace Blog.Application.Users.LogInUser;

public sealed record LogInUserCommand(string Email, string Password) : IRequest<Result<AccessTokenResponse>>;