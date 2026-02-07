using Blog.Domain.Abstractions;
using MediatR;

namespace Blog.Application.Articles.CreateArticleDraft;

public sealed record CreateArticleDraftCommand : IRequest<Result<CreateArticleDraftResponse>>
{
    public required string IdentityId { get; init; }
    public required string Title { get; init; }
    public required string Subtitle { get; init; }
    public required string Content { get; init; }
}

public sealed record CreateArticleDraftResponse(Guid Id, string Slug);