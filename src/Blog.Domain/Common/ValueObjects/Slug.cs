using System.Text.RegularExpressions;
using Blog.Domain.Abstractions;

namespace Blog.Domain.Common.ValueObjects;

public readonly record struct Slug
{
    private static readonly Regex SlugRegex = new(
        @"^[a-z0-9]+(?:-[a-z0-9]+)*$",
        RegexOptions.Compiled);

    public const int MaxLength = 250;

    public string Value { get; }

    private Slug(string value) => Value = value;

    public static Result<Slug> Create(string? slug)
    {
        if (string.IsNullOrWhiteSpace(slug))
        {
            return Result.Failure<Slug>(SlugErrors.Empty);
        }

        slug = slug.Trim().ToLowerInvariant();

        if (slug.Length > MaxLength)
        {
            return Result.Failure<Slug>(SlugErrors.TooLong);
        }

        if (!SlugRegex.IsMatch(slug))
        {
            return Result.Failure<Slug>(SlugErrors.InvalidFormat);
        }

        return Result.Success(new Slug(slug));
    }

    public static Result<Slug> FromTitle(string? title)
    {
        if (string.IsNullOrWhiteSpace(title))
        {
            return Result.Failure<Slug>(SlugErrors.Empty);
        }

        var slug = title
            .ToLowerInvariant()
            .Replace(' ', '-');

        slug = Regex.Replace(slug, @"-+", "-");
        slug = Regex.Replace(slug, @"[^a-z0-9-]", "");
        slug = slug.Trim('-');

        if (string.IsNullOrEmpty(slug))
        {
            return Result.Failure<Slug>(SlugErrors.InvalidFormat);
        }

        return Create(slug);
    }

    public static implicit operator string(Slug slug) => slug.Value;

    public override string ToString() => Value;
}

public static class SlugErrors
{
    public static readonly Error Empty = Error.Failure(
        "Slug.Empty",
        "Slug cannot be empty");

    public static readonly Error TooLong = Error.Failure(
        "Slug.TooLong",
        $"Slug cannot exceed {Slug.MaxLength} characters");

    public static readonly Error InvalidFormat = Error.Failure(
        "Slug.InvalidFormat",
        "Slug must contain only lowercase letters, numbers, and hyphens");
}
