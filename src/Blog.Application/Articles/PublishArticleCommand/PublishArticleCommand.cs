using Blog.Domain.Abstractions;
using MediatR;

namespace Blog.Application.Articles.PublishArticleCommand;

public sealed record PublishArticleCommand : IRequest<Result>
{
    public required Guid ArticleId { get; init; }
}