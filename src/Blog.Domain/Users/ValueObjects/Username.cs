using System.Text.RegularExpressions;
using Blog.Domain.Abstractions;

namespace Blog.Domain.Users.ValueObjects;

public readonly record struct Username
{
    private static readonly Regex UsernameRegex = new(
        @"^[a-zA-Z0-9_-]+$",
        RegexOptions.Compiled);

    public const int MinLength = 3;
    public const int MaxLength = 50;

    public string Value { get; }

    private Username(string value) => Value = value;

    public static Result<Username> Create(string? username)
    {
        if (string.IsNullOrWhiteSpace(username))
        {
            return Result.Failure<Username>(UsernameErrors.Empty);
        }

        username = username.Trim();

        if (username.Length < MinLength)
        {
            return Result.Failure<Username>(UsernameErrors.TooShort);
        }

        if (username.Length > MaxLength)
        {
            return Result.Failure<Username>(UsernameErrors.TooLong);
        }

        if (!UsernameRegex.IsMatch(username))
        {
            return Result.Failure<Username>(UsernameErrors.InvalidCharacters);
        }

        return Result.Success(new Username(username));
    }

    public static implicit operator string(Username username) => username.Value;

    public override string ToString() => Value;
}

public static class UsernameErrors
{
    public static readonly Error Empty = Error.Failure(
        "Username.Empty",
        "Username cannot be empty");

    public static readonly Error TooShort = Error.Failure(
        "Username.TooShort",
        $"Username must be at least {Username.MinLength} characters");

    public static readonly Error TooLong = Error.Failure(
        "Username.TooLong",
        $"Username cannot exceed {Username.MaxLength} characters");

    public static readonly Error InvalidCharacters = Error.Failure(
        "Username.InvalidCharacters",
        "Username can only contain letters, numbers, underscores, and hyphens");
}
