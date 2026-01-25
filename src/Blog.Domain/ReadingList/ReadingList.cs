using System;
using Blog.Domain.Abstractions;
using Blog.Domain.Users;

namespace Blog.Domain.ReadingList;

public sealed class ReadingList : Entity
{
    private readonly List<ReadingListItem> _items = new();

    public Guid UserId { get; private set; }
    public string Name { get; private set; }
    public string? Description { get; private set; }
    public bool IsPrivate { get; private set; }
    public DateTime CreatedAt { get; private set; }

    public IReadOnlyList<ReadingListItem> Items => _items.AsReadOnly();

    // Navigation properties
    public User User { get; private set; }
}