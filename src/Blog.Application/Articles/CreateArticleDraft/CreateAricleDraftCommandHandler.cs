using Blog.Application.Common.Interfaces;
using Blog.Domain.Abstractions;
using Blog.Domain.Articles;
using MediatR;

namespace Blog.Application.Articles.CreateArticleDraft;

public sealed class CreateArticleDraftCommandHandler
    : IRequestHandler<CreateArticleDraftCommand, Result<Guid>>
{
    private readonly IArticleRepository _repository;

    public CreateArticleDraftCommandHandler(IArticleRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<Guid>> Handle(
        CreateArticleDraftCommand request,
        CancellationToken cancellationToken)
    {
        var slug = GenerateSlug(request.Title);

        var article = Article.CreateDraft(
            request.AuthorId,
            request.Title,
            slug,
            request.Subtitle,
            request.Content);

        await _repository.AddAsync(article, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);

        return Result.Success(article.Id);
    }

    private static string GenerateSlug(string title)
    {
        // Simple slug generation (you can improve this later)
        var slug = title
            .ToLowerInvariant()
            .Replace(" ", "-")
            .Replace("'", "")
            .Replace("\"", "")
            .Replace(".", "")
            .Replace(",", "");

        // Add random suffix to ensure uniqueness
        return $"{slug}-{Guid.NewGuid().ToString("N")[..8]}";
    }
}