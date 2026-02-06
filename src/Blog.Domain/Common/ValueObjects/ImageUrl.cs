using Blog.Domain.Abstractions;

namespace Blog.Domain.Common.ValueObjects;

public readonly record struct ImageUrl
{
    private static readonly string[] AllowedExtensions =
        [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];

    private static readonly string[] AllowedSchemes = ["https", "http"];

    public const int MaxLength = 1000;

    public string Value { get; }

    private ImageUrl(string value) => Value = value;

    public static Result<ImageUrl> Create(string? url)
    {
        if (string.IsNullOrWhiteSpace(url))
        {
            return Result.Failure<ImageUrl>(ImageUrlErrors.Empty);
        }

        url = url.Trim();

        if (url.Length > MaxLength)
        {
            return Result.Failure<ImageUrl>(ImageUrlErrors.TooLong);
        }

        if (!Uri.TryCreate(url, UriKind.Absolute, out var uri))
        {
            return Result.Failure<ImageUrl>(ImageUrlErrors.InvalidFormat);
        }

        if (!AllowedSchemes.Contains(uri.Scheme.ToLowerInvariant()))
        {
            return Result.Failure<ImageUrl>(ImageUrlErrors.InvalidScheme);
        }

        var extension = Path.GetExtension(uri.LocalPath).ToLowerInvariant();
        if (!string.IsNullOrEmpty(extension) &&
            !AllowedExtensions.Contains(extension))
        {
            return Result.Failure<ImageUrl>(ImageUrlErrors.InvalidExtension);
        }

        return Result.Success(new ImageUrl(url));
    }

    public static implicit operator string(ImageUrl url) => url.Value;

    public override string ToString() => Value;
}

public static class ImageUrlErrors
{
    public static readonly Error Empty = Error.Failure(
        "ImageUrl.Empty",
        "Image URL cannot be empty");

    public static readonly Error TooLong = Error.Failure(
        "ImageUrl.TooLong",
        $"Image URL cannot exceed {ImageUrl.MaxLength} characters");

    public static readonly Error InvalidFormat = Error.Failure(
        "ImageUrl.InvalidFormat",
        "Image URL format is invalid");

    public static readonly Error InvalidScheme = Error.Failure(
        "ImageUrl.InvalidScheme",
        "Image URL must use HTTP or HTTPS");

    public static readonly Error InvalidExtension = Error.Failure(
        "ImageUrl.InvalidExtension",
        "Image URL must point to a valid image file");
}
