using FluentValidation;

namespace Blog.Application.Images.UploadImage;

public sealed class UploadImageCommandValidator
    : AbstractValidator<UploadImageCommand>
{
    private static readonly string[] AllowedExtensions =
        [".jpg", ".jpeg", ".png", ".gif", ".webp"];

    private static readonly string[] AllowedContentTypes =
        ["image/jpeg", "image/png", "image/gif", "image/webp"];

    private const long MaxFileSizeBytes = 5 * 1024 * 1024; // 5MB

    public UploadImageCommandValidator()
    {
        RuleFor(x => x.IdentityId)
            .NotEmpty()
            .WithMessage("Identity ID is required");

        RuleFor(x => x.FileName)
            .NotEmpty()
            .WithMessage("File name is required")
            .Must(HasValidExtension)
            .WithMessage("File must be an image (jpg, jpeg, png, gif, webp)");

        RuleFor(x => x.ContentType)
            .NotEmpty()
            .WithMessage("Content type is required")
            .Must(IsValidContentType)
            .WithMessage("Invalid content type. Allowed: image/jpeg, image/png, image/gif, image/webp");

        RuleFor(x => x.FileStream)
            .NotNull()
            .WithMessage("File is required")
            .Must(stream => stream.Length > 0)
            .WithMessage("File cannot be empty")
            .Must(stream => stream.Length <= MaxFileSizeBytes)
            .WithMessage($"File size cannot exceed {MaxFileSizeBytes / (1024 * 1024)}MB");

        RuleFor(x => x.ContainerName)
            .NotEmpty()
            .WithMessage("Container name is required");
    }

    private static bool HasValidExtension(string fileName)
    {
        var extension = Path.GetExtension(fileName)?.ToLowerInvariant();
        return !string.IsNullOrEmpty(extension) &&
               AllowedExtensions.Contains(extension);
    }

    private static bool IsValidContentType(string contentType)
    {
        return AllowedContentTypes.Contains(contentType.ToLowerInvariant());
    }
}
