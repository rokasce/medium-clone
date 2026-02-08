using Blog.Application.Common.Interfaces;
using Blog.Domain.Reactions;
using Microsoft.EntityFrameworkCore;

namespace Blog.Infrastructure.Persistance.Repositories;

public sealed class ArticleClapRepository : Repository<ArticleClap>, IArticleClapRepository
{
    public ArticleClapRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<ArticleClap?> GetByArticleAndUserAsync(
        Guid articleId,
        Guid userId,
        CancellationToken cancellationToken)
    {
        return await DbSet
            .FirstOrDefaultAsync(ac => ac.ArticleId == articleId && ac.UserId == userId, cancellationToken);
    }

    public async Task<int> GetTotalClapsForArticleAsync(
        Guid articleId,
        CancellationToken cancellationToken)
    {
        return await DbSet
            .Where(ac => ac.ArticleId == articleId)
            .SumAsync(ac => ac.ClapCount, cancellationToken);
    }

    public async Task<int> GetUserClapsForArticleAsync(
        Guid articleId,
        Guid userId,
        CancellationToken cancellationToken)
    {
        var clap = await DbSet
            .FirstOrDefaultAsync(ac => ac.ArticleId == articleId && ac.UserId == userId, cancellationToken);

        return clap?.ClapCount ?? 0;
    }

    public async Task<Dictionary<Guid, int>> GetTotalClapsForArticlesAsync(
        IEnumerable<Guid> articleIds,
        CancellationToken cancellationToken)
    {
        var articleIdList = articleIds.ToList();

        return await DbSet
            .Where(ac => articleIdList.Contains(ac.ArticleId))
            .GroupBy(ac => ac.ArticleId)
            .Select(g => new { ArticleId = g.Key, TotalClaps = g.Sum(ac => ac.ClapCount) })
            .ToDictionaryAsync(x => x.ArticleId, x => x.TotalClaps, cancellationToken);
    }
}
