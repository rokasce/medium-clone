using Blog.Application.Common.Interfaces;
using Blog.Domain.Comments;
using Blog.Domain.Comments.ValueObjects;
using Microsoft.EntityFrameworkCore;

namespace Blog.Infrastructure.Persistance.Repositories;

public sealed class CommentRepository : Repository<Comment>, ICommentRepository
{
    public CommentRepository(ApplicationDbContext context) : base(context)
    {
    }

    public override async Task<Comment?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken)
    {
        return await DbSet
            .Include(c => c.Author)
                .ThenInclude(a => a.User)
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
    }

    public async Task<List<Comment>> GetByArticleIdAsync(
        Guid articleId,
        CancellationToken cancellationToken)
    {
        return await DbSet
            .Include(c => c.Author)
                .ThenInclude(a => a.User)
            .Where(c => c.ArticleId == articleId
                && c.ParentCommentId == null
                && c.Status != CommentStatus.Deleted)
            .OrderBy(c => c.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Comment>> GetRepliesAsync(
        Guid parentCommentId,
        CancellationToken cancellationToken)
    {
        return await DbSet
            .Include(c => c.Author)
                .ThenInclude(a => a.User)
            .Where(c => c.ParentCommentId == parentCommentId
                && c.Status != CommentStatus.Deleted)
            .OrderBy(c => c.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<int> GetCommentCountByArticleAsync(
        Guid articleId,
        CancellationToken cancellationToken)
    {
        return await DbSet
            .Where(c => c.ArticleId == articleId && c.Status != CommentStatus.Deleted)
            .CountAsync(cancellationToken);
    }
}
