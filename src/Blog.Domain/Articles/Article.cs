using Blog.Domain.Abstractions;
using Blog.Domain.Articles.Events;
using Blog.Domain.Articles.ValueObjects;
using Blog.Domain.Common.ValueObjects;
using Blog.Domain.Publications;
using Blog.Domain.Publications.ValueObjects;
using Blog.Domain.Users;
using Blog.Domain.Users.ValueObjects;

namespace Blog.Domain.Articles;

public sealed class Article : Entity
{
    private Article() { } // EF Core

    private Article(
        Guid id,
        AuthorId authorId,
        string title,
        Slug slug,
        string subtitle,
        string content)
    {
        Id = id;
        AuthorId = authorId;
        Title = title;
        Slug = slug;
        Subtitle = subtitle;
        Content = content;
        Status = ArticleStatus.Draft;
        CreatedAt = DateTime.UtcNow;
    }

    private readonly List<ArticleTag> _tags = new();
    private readonly List<ArticleRevision> _revisions = new();

    public AuthorId AuthorId { get; private set; }
    public PublicationId? PublicationId { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public Slug Slug { get; private set; }
    public string Subtitle { get; private set; } = string.Empty;
    public string Content { get; private set; } = string.Empty;
    public ImageUrl? FeaturedImageUrl { get; private set; }
    public ArticleStatus Status { get; private set; }
    public int ReadingTimeMinutes { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? PublishedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    public IReadOnlyList<ArticleTag> Tags => _tags.AsReadOnly();
    public IReadOnlyList<ArticleRevision> Revisions => _revisions.AsReadOnly();

    // Navigation properties
    public Author Author { get; private set; } = null!;
    public Publication? Publication { get; private set; }

    // ========== FACTORY METHODS ==========

    public static Result<Article> CreateDraft(
        AuthorId authorId,
        string title,
        string slug,
        string subtitle,
        string content)
    {
        var slugResult = Slug.Create(slug);
        if (slugResult.IsFailure)
        {
            return Result.Failure<Article>(slugResult.Error);
        }

        var article = new Article(
            Guid.NewGuid(),
            authorId,
            title,
            slugResult.Value,
            subtitle,
            content);

        article.CalculateReadingTime();

        article.AddDomainEvent(new ArticleDraftCreated
        {
            ArticleId = article.Id,
            AuthorId = article.AuthorId,
            Title = article.Title
        });

        return Result.Success(article);
    }

    // ========== COMMAND METHODS (State Changes) ==========

    public Result Publish()
    {
        if (Status == ArticleStatus.Published)
        {
            return Result.Failure(ArticleErrors.AlreadyPublished);
        }

        if (Status == ArticleStatus.Deleted)
        {
            return Result.Failure(ArticleErrors.CannotPublishDeleted);
        }

        if (string.IsNullOrWhiteSpace(Content))
        {
            return Result.Failure(ArticleErrors.EmptyContent);
        }

        Status = ArticleStatus.Published;
        PublishedAt = DateTime.UtcNow;

        AddDomainEvent(new ArticlePublished
        {
            ArticleId = Id,
            AuthorId = AuthorId,
            Title = Title,
            Slug = Slug,
            PublishedAt = PublishedAt.Value,
            Tags = _tags.Select(t => t.TagId).ToList()
        });

        return Result.Success();
    }

    public Result Unpublish()
    {
        if (Status != ArticleStatus.Published)
        {
            return Result.Failure(ArticleErrors.NotPublished);
        }

        Status = ArticleStatus.Unpublished;
        UpdatedAt = DateTime.UtcNow;

        AddDomainEvent(new ArticleUnpublished
        {
            ArticleId = Id,
            UnpublishedAt = UpdatedAt.Value
        });

        return Result.Success();
    }

    public Result UpdateContent(string title, string subtitle, string content)
    {
        if (Status == ArticleStatus.Deleted)
        {
            return Result.Failure(ArticleErrors.CannotUpdateDeleted);
        }

        var previousVersion = new ArticleRevision(
            Id,
            Title,
            Content,
            _revisions.Count + 1);

        _revisions.Add(previousVersion);

        Title = title;
        Subtitle = subtitle;
        Content = content;
        UpdatedAt = DateTime.UtcNow;

        CalculateReadingTime();

        AddDomainEvent(new ArticleUpdated
        {
            ArticleId = Id,
            Title = title
        });

        return Result.Success();
    }

    public void Delete()
    {
        Status = ArticleStatus.Deleted;
        UpdatedAt = DateTime.UtcNow;

        AddDomainEvent(new ArticleDeleted
        {
            ArticleId = Id,
            DeletedAt = UpdatedAt.Value
        });
    }

    public Result SetFeaturedImage(string imageUrl)
    {
        var result = ImageUrl.Create(imageUrl);
        if (result.IsFailure)
        {
            return Result.Failure(result.Error);
        }

        FeaturedImageUrl = result.Value;
        UpdatedAt = DateTime.UtcNow;

        AddDomainEvent(new ArticleFeaturedImageChanged
        {
            ArticleId = Id,
            ImageUrl = imageUrl
        });

        return Result.Success();
    }

    public void RemoveFeaturedImage()
    {
        FeaturedImageUrl = null;
        UpdatedAt = DateTime.UtcNow;
    }

    public void AddTag(TagId tagId)
    {
        if (_tags.Any(t => t.TagId == tagId))
        {
            return; // Already has this tag
        }

        var articleTag = new ArticleTag(Id, tagId);
        _tags.Add(articleTag);

        UpdatedAt = DateTime.UtcNow;
    }

    public void RemoveTag(TagId tagId)
    {
        var tag = _tags.FirstOrDefault(t => t.TagId == tagId);
        if (tag is not null)
        {
            _tags.Remove(tag);
            UpdatedAt = DateTime.UtcNow;
        }
    }

    public void UpdateTags(IEnumerable<TagId> tagIds)
    {
        _tags.Clear();

        foreach (var tagId in tagIds)
        {
            _tags.Add(new ArticleTag(Id, tagId));
        }

        UpdatedAt = DateTime.UtcNow;

        AddDomainEvent(new ArticleTagsUpdated
        {
            ArticleId = Id,
            TagIds = tagIds.ToList()
        });
    }

    public void SubmitToPublication(PublicationId publicationId)
    {
        if (Status != ArticleStatus.Published)
        {
            throw new InvalidOperationException(
                "Only published articles can be submitted to publications");
        }

        AddDomainEvent(new ArticleSubmittedToPublication
        {
            ArticleId = Id,
            PublicationId = publicationId,
            SubmittedAt = DateTime.UtcNow
        });
    }

    public void AssignToPublication(PublicationId publicationId)
    {
        PublicationId = publicationId;
        UpdatedAt = DateTime.UtcNow;

        AddDomainEvent(new ArticleAcceptedByPublication
        {
            ArticleId = Id,
            PublicationId = publicationId,
            AcceptedAt = DateTime.UtcNow
        });
    }

    public void RemoveFromPublication()
    {
        if (PublicationId is null)
        {
            return;
        }

        var previousPublicationId = PublicationId.Value;
        PublicationId = null;
        UpdatedAt = DateTime.UtcNow;

        AddDomainEvent(new ArticleRemovedFromPublication
        {
            ArticleId = Id,
            PublicationId = previousPublicationId
        });
    }

    // ========== PRIVATE HELPER METHODS ==========

    private void CalculateReadingTime()
    {
        const int wordsPerMinute = 200;
        var wordCount = Content.Split(
            new[] { ' ', '\n', '\r' },
            StringSplitOptions.RemoveEmptyEntries).Length;

        ReadingTimeMinutes = Math.Max(1, wordCount / wordsPerMinute);

        AddDomainEvent(new ArticleReadingTimeCalculated
        {
            ArticleId = Id,
            ReadingTimeMinutes = ReadingTimeMinutes
        });
    }
}
