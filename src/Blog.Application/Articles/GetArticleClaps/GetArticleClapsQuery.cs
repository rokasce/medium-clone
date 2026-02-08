using Blog.Domain.Abstractions;
using MediatR;

namespace Blog.Application.Articles.GetArticleClaps;

public sealed record GetArticleClapsQuery(Guid ArticleId, string? IdentityId) : IRequest<Result<ArticleClapsResponse>>;

public sealed record ArticleClapsResponse(
    int TotalClaps,
    int UserClaps,
    int RemainingClaps);
