using Blog.Domain.Abstractions;

namespace Blog.Domain.Users;

public static class UserErrors
{
    public static Error NotFound = Error.Failure(
        "User.NotFound",
        "The user with the specified identifier was not found");

    public static Error InvalidCredentials = Error.Failure(
        "User.InvalidCredentials",
        "The provided credentials were invalid");
}