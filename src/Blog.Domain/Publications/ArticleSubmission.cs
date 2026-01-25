using Blog.Domain.Abstractions;
using Blog.Domain.Articles;
using Blog.Domain.Publications.ValueObjects;
using Blog.Domain.Users;

namespace Blog.Domain.Publications;

public sealed class ArticleSubmission : Entity
{
    public Guid ArticleId { get; private set; }
    public Guid PublicationId { get; private set; }
    public Guid AuthorId { get; private set; }
    public SubmissionStatus Status { get; private set; }
    public string? ReviewNotes { get; private set; }
    public Guid? ReviewedByEditorId { get; private set; }
    public DateTime SubmittedAt { get; private set; }
    public DateTime? ReviewedAt { get; private set; }

    // Navigation properties
    public Article Article { get; private set; }
    public Publication Publication { get; private set; }
    public Author Author { get; private set; }
    public User? ReviewedByEditor { get; private set; }
}