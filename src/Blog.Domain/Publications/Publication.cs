using Blog.Domain.Abstractions;
using Blog.Domain.Articles;
using Blog.Domain.Users;

namespace Blog.Domain.Publications;

public sealed class Publication : Entity
{
    private readonly List<Article> _articles = new();
    private readonly List<PublicationEditor> _editors = new();
    private readonly List<ArticleSubmission> _submissions = new();

    public Guid OwnerId { get; private set; }
    public string Name { get; private set; }
    public string Slug { get; private set; }
    public string Description { get; private set; }
    public string? LogoUrl { get; private set; }
    public int FollowerCount { get; private set; }
    public DateTime CreatedAt { get; private set; }

    public IReadOnlyList<Article> Articles => _articles.AsReadOnly();
    public IReadOnlyList<PublicationEditor> Editors => _editors.AsReadOnly();
    public IReadOnlyList<ArticleSubmission> Submissions => _submissions.AsReadOnly();

    // Navigation properties
    public User Owner { get; private set; }
}