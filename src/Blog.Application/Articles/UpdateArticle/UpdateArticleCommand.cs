using Blog.Domain.Abstractions;
using MediatR;

namespace Blog.Application.Articles.UpdateArticle;

public sealed record UpdateArticleCommand : IRequest<Result>
{
    public required Guid ArticleId { get; init; }
    public required string IdentityId { get; init; }
    public required string Title { get; init; }
    public required string Subtitle { get; init; }
    public required string Content { get; init; }
    public string? FeaturedImageUrl { get; init; }
    public List<string> Tags { get; init; } = [];
}
