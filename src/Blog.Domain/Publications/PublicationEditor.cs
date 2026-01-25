using Blog.Domain.Abstractions;
using Blog.Domain.Publications.ValueObjects;
using Blog.Domain.Users;

namespace Blog.Domain.Publications;

public sealed class PublicationEditor : Entity
{
    public Guid PublicationId { get; private set; }
    public Guid UserId { get; private set; }
    public EditorRole Role { get; private set; }
    public DateTime AddedAt { get; private set; }

    // Navigation properties
    public Publication Publication { get; private set; }
    public User User { get; private set; }
}