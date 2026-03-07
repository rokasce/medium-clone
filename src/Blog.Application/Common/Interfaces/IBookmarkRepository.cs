using Blog.Domain.ReadingList;

namespace Blog.Application.Common.Interfaces;

public interface IBookmarkRepository : IRepository<Bookmark>
{
    Task<Bookmark?> GetByUserAndArticleAsync(Guid userId, Guid articleId, CancellationToken cancellationToken);
    Task<List<Bookmark>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken);
    Task<bool> ExistsByUserAndArticleAsync(Guid userId, Guid articleId, CancellationToken cancellationToken);
}
