using Blog.Application.Common.Interfaces;
using Blog.Domain.Abstractions;
using Blog.Domain.Articles;
using MediatR;

namespace Blog.Application.Articles.GetArticleBySlug;

internal sealed class GetArticleBySlugQueryHandler
    : IRequestHandler<GetArticleBySlugQuery, Result<ArticleResponse>>
{
    private readonly IArticleRepository _articleRepository;
    private readonly IUserRepository _userRepository;
    private readonly IAuthorRepository _authorRepository;

    public GetArticleBySlugQueryHandler(
        IArticleRepository articleRepository,
        IUserRepository userRepository,
        IAuthorRepository authorRepository)
    {
        _articleRepository = articleRepository;
        _userRepository = userRepository;
        _authorRepository = authorRepository;
    }

    public async Task<Result<ArticleResponse>> Handle(
        GetArticleBySlugQuery request,
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdentityIdAsync(request.IdentityId, cancellationToken);

        if (user is null)
        {
            return Result.Failure<ArticleResponse>(ArticleErrors.Unauthorized);
        }

        var author = await _authorRepository.GetByUserIdAsync(user.Id, cancellationToken);

        if (author is null)
        {
            return Result.Failure<ArticleResponse>(ArticleErrors.Unauthorized);
        }

        var article = await _articleRepository.GetBySlugAsync(request.Slug, cancellationToken);

        if (article is null)
        {
            return Result.Failure<ArticleResponse>(ArticleErrors.NotFound);
        }

        // Verify the article belongs to the current user
        if (article.AuthorId != author.Id)
        {
            return Result.Failure<ArticleResponse>(ArticleErrors.Unauthorized);
        }

        var response = new ArticleResponse(
            article.Id,
            article.Title,
            article.Slug,
            article.Subtitle,
            article.Content,
            article.FeaturedImageUrl.HasValue ? article.FeaturedImageUrl.Value.Value : null,
            article.ReadingTimeMinutes,
            article.CreatedAt,
            article.PublishedAt,
            new AuthorResponse(
                author.Id,
                user.Username,
                user.DisplayName,
                user.AvatarUrl.HasValue ? user.AvatarUrl.Value.Value : null));

        return Result.Success(response);
    }
}
