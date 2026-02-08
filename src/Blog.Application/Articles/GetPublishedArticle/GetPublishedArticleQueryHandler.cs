using Blog.Application.Common.Interfaces;
using Blog.Domain.Abstractions;
using Blog.Domain.Articles;
using MediatR;

namespace Blog.Application.Articles.GetPublishedArticle;

internal sealed class GetPublishedArticleQueryHandler
    : IRequestHandler<GetPublishedArticleQuery, Result<PublishedArticleDetailResponse>>
{
    private readonly IArticleRepository _articleRepository;
    private readonly IArticleClapRepository _clapRepository;

    public GetPublishedArticleQueryHandler(
        IArticleRepository articleRepository,
        IArticleClapRepository clapRepository)
    {
        _articleRepository = articleRepository;
        _clapRepository = clapRepository;
    }

    public async Task<Result<PublishedArticleDetailResponse>> Handle(
        GetPublishedArticleQuery request,
        CancellationToken cancellationToken)
    {
        var article = await _articleRepository.GetPublishedBySlugAsync(request.Slug, cancellationToken);

        if (article is null)
        {
            return Result.Failure<PublishedArticleDetailResponse>(ArticleErrors.NotFound);
        }

        var clapCount = await _clapRepository.GetTotalClapsForArticleAsync(article.Id, cancellationToken);

        var tags = article.Tags
            .Select(at => new PublishedArticleTagResponse(at.Tag.Id, at.Tag.Name, at.Tag.Slug))
            .ToList();

        var response = new PublishedArticleDetailResponse(
            article.Id,
            article.Title,
            article.Slug,
            article.Subtitle,
            article.Content,
            article.FeaturedImageUrl.HasValue ? article.FeaturedImageUrl.Value.Value : null,
            article.ReadingTimeMinutes,
            article.PublishedAt!.Value,
            clapCount,
            new PublishedArticleAuthorResponse(
                article.Author.Id,
                article.Author.User.Username,
                article.Author.User.DisplayName,
                article.Author.User.AvatarUrl.HasValue ? article.Author.User.AvatarUrl.Value.Value : null),
            tags);

        return Result.Success(response);
    }
}
