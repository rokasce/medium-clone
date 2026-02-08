using Blog.Domain.Abstractions;
using MediatR;

namespace Blog.Application.Images.UploadImage;

public sealed record UploadImageCommand : IRequest<Result<UploadImageResponse>>
{
    public required Stream FileStream { get; init; }
    public required string FileName { get; init; }
    public required string ContentType { get; init; }
    public required string ContainerName { get; init; }
    public required string IdentityId { get; init; }
}

public sealed record UploadImageResponse(string Url);
