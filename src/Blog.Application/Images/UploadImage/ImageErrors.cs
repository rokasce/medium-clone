using Blog.Domain.Abstractions;

namespace Blog.Application.Images.UploadImage;

public static class ImageErrors
{
    public static readonly Error Unauthorized = Error.Failure(
        "Image.Unauthorized",
        "User is not authorized to upload images");

    public static readonly Error UploadFailed = Error.Failure(
        "Image.UploadFailed",
        "Failed to upload image to storage");

    public static readonly Error InvalidFile = Error.Failure(
        "Image.InvalidFile",
        "The uploaded file is not a valid image");

    public static readonly Error FileTooLarge = Error.Failure(
        "Image.FileTooLarge",
        "The uploaded file exceeds the maximum allowed size");

    public static readonly Error EmptyFile = Error.Failure(
        "Image.EmptyFile",
        "No file was uploaded");
}
