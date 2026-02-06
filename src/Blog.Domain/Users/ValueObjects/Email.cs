using System.Text.RegularExpressions;
using Blog.Domain.Abstractions;

namespace Blog.Domain.Users.ValueObjects;

public readonly record struct Email
{
    private static readonly Regex EmailRegex = new(
        @"^[^@\s]+@[^@\s]+\.[^@\s]+$",
        RegexOptions.Compiled | RegexOptions.IgnoreCase);

    public const int MaxLength = 256;

    public string Value { get; }

    private Email(string value) => Value = value;

    public static Result<Email> Create(string? email)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            return Result.Failure<Email>(EmailErrors.Empty);
        }

        email = email.Trim().ToLowerInvariant();

        if (email.Length > MaxLength)
        {
            return Result.Failure<Email>(EmailErrors.TooLong);
        }

        if (!EmailRegex.IsMatch(email))
        {
            return Result.Failure<Email>(EmailErrors.InvalidFormat);
        }

        return Result.Success(new Email(email));
    }

    public static implicit operator string(Email email) => email.Value;

    public override string ToString() => Value;
}

public static class EmailErrors
{
    public static readonly Error Empty = Error.Failure(
        "Email.Empty",
        "Email cannot be empty");

    public static readonly Error TooLong = Error.Failure(
        "Email.TooLong",
        $"Email cannot exceed {Email.MaxLength} characters");

    public static readonly Error InvalidFormat = Error.Failure(
        "Email.InvalidFormat",
        "Email format is invalid");
}
