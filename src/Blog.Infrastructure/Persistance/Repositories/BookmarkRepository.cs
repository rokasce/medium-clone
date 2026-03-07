using Blog.Application.Common.Interfaces;
using Blog.Domain.ReadingList;
using Microsoft.EntityFrameworkCore;

namespace Blog.Infrastructure.Persistance.Repositories;

public sealed class BookmarkRepository : Repository<Bookmark>, IBookmarkRepository
{
    public BookmarkRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Bookmark?> GetByUserAndArticleAsync(
        Guid userId,
        Guid articleId,
        CancellationToken cancellationToken)
    {
        return await DbSet
            .FirstOrDefaultAsync(b => b.UserId == userId && b.ArticleId == articleId, cancellationToken);
    }

    public async Task<List<Bookmark>> GetByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken)
    {
        return await DbSet
            .Include(b => b.Article)
                .ThenInclude(a => a.Author)
                    .ThenInclude(au => au.User)
            .Where(b => b.UserId == userId)
            .OrderByDescending(b => b.BookmarkedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> ExistsByUserAndArticleAsync(
        Guid userId,
        Guid articleId,
        CancellationToken cancellationToken)
    {
        return await DbSet
            .AnyAsync(b => b.UserId == userId && b.ArticleId == articleId, cancellationToken);
    }
}
