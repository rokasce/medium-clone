using Blog.Domain.Abstractions;
using MediatR;

namespace Blog.Application.Articles.ClapArticle;

public sealed record ClapArticleCommand : IRequest<Result<ClapArticleResponse>>
{
    public required Guid ArticleId { get; init; }
    public required string IdentityId { get; init; }
    public required int ClapCount { get; init; }
}

public sealed record ClapArticleResponse(
    int TotalClaps,
    int UserClaps,
    int RemainingClaps);
