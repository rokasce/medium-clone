using Blog.Domain.Abstractions;
using MediatR;

namespace Blog.Application.Articles.DeleteArticle;

public sealed record DeleteArticleCommand : IRequest<Result>
{
    public required Guid ArticleId { get; init; }
    public required string IdentityId { get; init; }
}
