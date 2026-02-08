using Blog.Domain.Abstractions;

namespace Blog.Application.Common.Interfaces;

public interface IFileStorageService
{
    Task<Result<string>> UploadAsync(
        Stream fileStream,
        string fileName,
        string containerName,
        CancellationToken cancellationToken = default);

    Task<Result> DeleteAsync(
        string fileUrl,
        CancellationToken cancellationToken = default);

    Task<bool> ExistsAsync(
        string fileUrl,
        CancellationToken cancellationToken = default);
}
