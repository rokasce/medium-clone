using Blog.Domain.Abstractions;
using Blog.Domain.Articles;

namespace Blog.Domain.ReadingList;

public sealed class ReadingListItem : Entity
{
    public Guid ReadingListId { get; private set; }
    public Guid ArticleId { get; private set; }
    public int SortOrder { get; private set; }
    public DateTime AddedAt { get; private set; }

    // Navigation properties
    public ReadingList ReadingList { get; private set; }
    public Article Article { get; private set; }
}