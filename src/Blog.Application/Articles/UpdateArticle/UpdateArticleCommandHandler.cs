using Blog.Application.Common.Interfaces;
using Blog.Domain.Abstractions;
using Blog.Domain.Articles;
using Blog.Domain.Users;
using MediatR;

namespace Blog.Application.Articles.UpdateArticle;

internal sealed class UpdateArticleCommandHandler
    : IRequestHandler<UpdateArticleCommand, Result>
{
    private readonly IArticleRepository _articleRepository;
    private readonly IUserRepository _userRepository;
    private readonly IAuthorRepository _authorRepository;
    private readonly ITagRepository _tagRepository;

    public UpdateArticleCommandHandler(
        IArticleRepository articleRepository,
        IUserRepository userRepository,
        IAuthorRepository authorRepository,
        ITagRepository tagRepository)
    {
        _articleRepository = articleRepository;
        _userRepository = userRepository;
        _authorRepository = authorRepository;
        _tagRepository = tagRepository;
    }

    public async Task<Result> Handle(
        UpdateArticleCommand request,
        CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdentityIdAsync(request.IdentityId, cancellationToken);

        if (user is null)
        {
            return Result.Failure(UserErrors.NotFound);
        }

        var author = await _authorRepository.GetByUserIdAsync(user.Id, cancellationToken);

        if (author is null)
        {
            return Result.Failure(ArticleErrors.Unauthorized);
        }

        var article = await _articleRepository.GetByIdAsync(request.ArticleId, cancellationToken);

        if (article is null)
        {
            return Result.Failure(ArticleErrors.NotFound);
        }

        if (article.AuthorId != author.Id)
        {
            return Result.Failure(ArticleErrors.Unauthorized);
        }

        // Update content
        var updateResult = article.UpdateContent(
            request.Title,
            request.Subtitle,
            request.Content);

        if (updateResult.IsFailure)
        {
            return updateResult;
        }

        // Update featured image
        if (!string.IsNullOrWhiteSpace(request.FeaturedImageUrl))
        {
            var imageResult = article.SetFeaturedImage(request.FeaturedImageUrl);
            if (imageResult.IsFailure)
            {
                return imageResult;
            }
        }
        else
        {
            article.RemoveFeaturedImage();
        }

        // Resolve tags by name, create if they don't exist
        var tagIds = await ResolveTagsAsync(request.Tags, cancellationToken);

        // Update tags
        article.UpdateTags(tagIds);

        _articleRepository.Update(article);
        await _articleRepository.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }

    private async Task<List<Guid>> ResolveTagsAsync(
        List<string> tagNames,
        CancellationToken cancellationToken)
    {
        if (tagNames.Count == 0)
        {
            return [];
        }

        var normalizedNames = tagNames
            .Select(n => n.Trim())
            .Where(n => !string.IsNullOrWhiteSpace(n))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        var existingTags = await _tagRepository.GetByNamesAsync(normalizedNames, cancellationToken);
        var existingTagNames = existingTags.Select(t => t.Name.ToLower()).ToHashSet();

        var tagIds = existingTags.Select(t => t.Id).ToList();

        // Create new tags for names that don't exist
        foreach (var name in normalizedNames)
        {
            if (!existingTagNames.Contains(name.ToLower()))
            {
                var slug = GenerateSlug(name);
                var tagResult = Tag.Create(name, slug);

                if (tagResult.IsSuccess)
                {
                    await _tagRepository.AddAsync(tagResult.Value, cancellationToken);
                    tagIds.Add(tagResult.Value.Id);
                }
            }
        }

        return tagIds;
    }

    private static string GenerateSlug(string name)
    {
        return name
            .ToLowerInvariant()
            .Replace(" ", "-")
            .Replace("_", "-");
    }
}
