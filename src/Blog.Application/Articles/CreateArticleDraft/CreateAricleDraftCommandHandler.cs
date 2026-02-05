using Blog.Application.Common.Interfaces;
using Blog.Domain.Abstractions;
using Blog.Domain.Articles;
using Blog.Domain.Users;
using MediatR;

namespace Blog.Application.Articles.CreateArticleDraft;

public sealed class CreateArticleDraftCommandHandler
    : IRequestHandler<CreateArticleDraftCommand, Result<Guid>>
{
    private readonly IArticleRepository _articleRepository;
    private readonly IAuthorRepository _authorRepository;
    private readonly IUserRepository _userRepository;

    public CreateArticleDraftCommandHandler(
        IArticleRepository articleRepository,
        IAuthorRepository authorRepository,
        IUserRepository userRepository)
    {
        _articleRepository = articleRepository;
        _authorRepository = authorRepository;
        _userRepository = userRepository;
    }

    public async Task<Result<Guid>> Handle(
        CreateArticleDraftCommand request,
        CancellationToken cancellationToken)
    {
        // Look up user by IdentityId (from Keycloak)
        var user = await _userRepository.GetByIdentityIdAsync(request.IdentityId, cancellationToken);

        if (user is null)
        {
            return Result.Failure<Guid>(UserErrors.NotFound);
        }

        // Get or create author for the user
        var author = await _authorRepository.GetByUserIdAsync(user.Id, cancellationToken);

        if (author is null)
        {
            // Auto-promote user to author on first article creation
            author = Author.Create(user.Id);
            await _authorRepository.AddAsync(author, cancellationToken);
        }

        var slug = GenerateSlug(request.Title);

        var article = Article.CreateDraft(
            author.Id,
            request.Title,
            slug,
            request.Subtitle,
            request.Content);

        await _articleRepository.AddAsync(article, cancellationToken);
        await _articleRepository.SaveChangesAsync(cancellationToken);

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