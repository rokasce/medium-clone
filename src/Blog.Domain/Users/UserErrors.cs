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

    public static Error AlreadyAuthor = Error.Failure(
        "User.AlreadyAuthor",
        "The user is already an author");

    public static Error AuthorNotFound = Error.Failure(
        "User.AuthorNotFound",
        "The user does not have an author profile");
}