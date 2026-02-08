using Blog.Domain.Abstractions;
using MediatR;

namespace Blog.Application.Articles.UnpublishArticle;

public sealed record UnpublishArticleCommand : IRequest<Result>
{
    public required Guid ArticleId { get; init; }
    public required string IdentityId { get; init; }
}
