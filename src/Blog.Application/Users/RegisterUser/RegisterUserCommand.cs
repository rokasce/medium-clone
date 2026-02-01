using Blog.Domain.Abstractions;
using MediatR;

namespace Blog.Application.Users.RegisterUser;

public sealed record RegisterUserCommand(string Email, string Password) : IRequest<Result<Guid>>;