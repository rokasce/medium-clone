using Blog.Application.Common.Interfaces;
using Blog.Domain.Abstractions;
using Blog.Domain.Users.ValueObjects;
using MediatR;

namespace Blog.Application.Images.UploadImage;

internal sealed class UploadImageCommandHandler
    : IRequestHandler<UploadImageCommand, Result<UploadImageResponse>>
{
    private readonly IFileStorageService _fileStorageService;
    private readonly IUserRepository _userRepository;

    public UploadImageCommandHandler(
        IFileStorageService fileStorageService,
        IUserRepository userRepository)
    {
        _fileStorageService = fileStorageService;
        _userRepository = userRepository;
    }

    public async Task<Result<UploadImageResponse>> Handle(
        UploadImageCommand request,
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdentityIdAsync(
            request.IdentityId,
            cancellationToken);

        if (user is null)
        {
            return Result.Failure<UploadImageResponse>(ImageErrors.Unauthorized);
        }

        var uploadResult = await _fileStorageService.UploadAsync(
            request.FileStream,
            request.FileName,
            request.ContainerName,
            cancellationToken);

        if (uploadResult.IsFailure)
        {
            return Result.Failure<UploadImageResponse>(uploadResult.Error);
        }

        return Result.Success(new UploadImageResponse(uploadResult.Value));
    }
}
