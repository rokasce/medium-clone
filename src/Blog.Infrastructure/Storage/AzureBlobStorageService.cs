using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Blog.Application.Common.Interfaces;
using Blog.Domain.Abstractions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Blog.Infrastructure.Storage;

internal sealed class AzureBlobStorageService : IFileStorageService
{
    private readonly BlobServiceClient _blobServiceClient;
    private readonly AzureStorageOptions _options;
    private readonly ILogger<AzureBlobStorageService> _logger;

    private static readonly Dictionary<string, string> ContentTypeMappings = new()
    {
        [".jpg"] = "image/jpeg",
        [".jpeg"] = "image/jpeg",
        [".png"] = "image/png",
        [".gif"] = "image/gif",
        [".webp"] = "image/webp",
        [".svg"] = "image/svg+xml"
    };

    public AzureBlobStorageService(
        BlobServiceClient blobServiceClient,
        IOptions<AzureStorageOptions> options,
        ILogger<AzureBlobStorageService> logger)
    {
        _blobServiceClient = blobServiceClient;
        _options = options.Value;
        _logger = logger;
    }

    public async Task<Result<string>> UploadAsync(
        Stream fileStream,
        string fileName,
        string containerName,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);

            await containerClient.CreateIfNotExistsAsync(
                PublicAccessType.Blob,
                cancellationToken: cancellationToken);

            var extension = Path.GetExtension(fileName).ToLowerInvariant();
            var blobName = $"{Guid.NewGuid()}{extension}";

            var blobClient = containerClient.GetBlobClient(blobName);

            var contentType = ContentTypeMappings.GetValueOrDefault(extension, "application/octet-stream");
            var uploadOptions = new BlobUploadOptions
            {
                HttpHeaders = new BlobHttpHeaders
                {
                    ContentType = contentType
                }
            };

            if (fileStream.CanSeek)
            {
                fileStream.Position = 0;
            }

            await blobClient.UploadAsync(fileStream, uploadOptions, cancellationToken);

            var url = $"{_options.BaseUrl}/{containerName}/{blobName}";

            _logger.LogInformation(
                "Successfully uploaded file {FileName} to {Url}",
                fileName,
                url);

            return Result.Success(url);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Failed to upload file {FileName} to container {Container}",
                fileName,
                containerName);

            return Result.Failure<string>(Error.Failure(
                "Storage.UploadFailed",
                "Failed to upload file to storage"));
        }
    }

    public async Task<Result> DeleteAsync(
        string fileUrl,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var uri = new Uri(fileUrl);
            var segments = uri.AbsolutePath.TrimStart('/').Split('/');

            if (segments.Length < 2)
            {
                return Result.Failure(Error.Failure(
                    "Storage.InvalidUrl",
                    "Invalid file URL format"));
            }

            var containerName = segments[0];
            var blobName = string.Join('/', segments.Skip(1));

            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            var blobClient = containerClient.GetBlobClient(blobName);

            var response = await blobClient.DeleteIfExistsAsync(
                cancellationToken: cancellationToken);

            if (response.Value)
            {
                _logger.LogInformation("Deleted blob {Url}", fileUrl);
            }

            return Result.Success();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete blob {Url}", fileUrl);

            return Result.Failure(Error.Failure(
                "Storage.DeleteFailed",
                "Failed to delete file from storage"));
        }
    }

    public async Task<bool> ExistsAsync(
        string fileUrl,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var uri = new Uri(fileUrl);
            var segments = uri.AbsolutePath.TrimStart('/').Split('/');

            if (segments.Length < 2)
            {
                return false;
            }

            var containerName = segments[0];
            var blobName = string.Join('/', segments.Skip(1));

            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            var blobClient = containerClient.GetBlobClient(blobName);

            var response = await blobClient.ExistsAsync(cancellationToken);
            return response.Value;
        }
        catch
        {
            return false;
        }
    }
}
