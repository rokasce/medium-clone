using Blog.Application.Common.Storage;
using Blog.Application.Images.UploadImage;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Blog.API.Controllers;

[Route("api/images")]
public sealed class ImagesController : ApiControllerBase
{
    private readonly ISender _sender;

    public ImagesController(ISender sender)
    {
        _sender = sender;
    }

    [Authorize]
    [HttpPost("articles")]
    [ProducesResponseType(typeof(ImageUploadResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> UploadArticleImage(
        IFormFile file,
        CancellationToken cancellationToken)
    {
        return await UploadImage(file, StorageContainers.ArticleImages, cancellationToken);
    }

    [Authorize]
    [HttpPost("avatars")]
    [ProducesResponseType(typeof(ImageUploadResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> UploadAvatar(
        IFormFile file,
        CancellationToken cancellationToken)
    {
        return await UploadImage(file, StorageContainers.Avatars, cancellationToken);
    }

    private async Task<IActionResult> UploadImage(
        IFormFile file,
        string containerName,
        CancellationToken cancellationToken)
    {
        var identityId = GetCurrentIdentityId();

        if (identityId is null)
        {
            return Unauthorized();
        }

        if (file is null || file.Length == 0)
        {
            return BadRequest(new ErrorResponse(
                "Image.EmptyFile",
                "No file was uploaded"));
        }

        await using var stream = file.OpenReadStream();

        var command = new UploadImageCommand
        {
            FileStream = stream,
            FileName = file.FileName,
            ContentType = file.ContentType,
            ContainerName = containerName,
            IdentityId = identityId
        };

        var result = await _sender.Send(command, cancellationToken);

        if (result.IsFailure)
        {
            return BadRequest(new ErrorResponse(
                result.Error.Code,
                result.Error.Message));
        }

        return Ok(new ImageUploadResponse(result.Value.Url));
    }
}

public sealed record ImageUploadResponse(string Url);
