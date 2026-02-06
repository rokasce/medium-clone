using Blog.Domain.Abstractions;
using Blog.Domain.Common.ValueObjects;

namespace Blog.Domain.Articles;

public sealed class Tag : Entity
{
    private Tag() { } // EF Core

    private Tag(Guid id, string name, Slug slug)
    {
        Id = id;
        Name = name;
        Slug = slug;
        ArticleCount = 0;
    }

    private readonly List<ArticleTag> _articles = new();

    public new Guid Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public Slug Slug { get; private set; }
    public int ArticleCount { get; private set; }

    public IReadOnlyList<ArticleTag> Articles => _articles.AsReadOnly();

    public static Result<Tag> Create(string name, string slug)
    {
        var slugResult = Slug.Create(slug);
        if (slugResult.IsFailure)
        {
            return Result.Failure<Tag>(slugResult.Error);
        }

        return Result.Success(new Tag(Guid.NewGuid(), name, slugResult.Value));
    }

    public void IncrementArticleCount()
    {
        ArticleCount++;
    }

    public void DecrementArticleCount()
    {
        if (ArticleCount > 0)
        {
            ArticleCount--;
        }
    }
}
