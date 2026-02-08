using Blog.Application.Common.Interfaces;
using Blog.Domain.Articles;
using Blog.Domain.Articles.ValueObjects;
using Microsoft.EntityFrameworkCore;

namespace Blog.Infrastructure.Persistance.Repositories;

public sealed class TagRepository : Repository<Tag>, ITagRepository
{
    public TagRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Tag?> GetByNameAsync(string name, CancellationToken cancellationToken)
    {
        return await DbSet
            .FirstOrDefaultAsync(t => t.Name.ToLower() == name.ToLower(), cancellationToken);
    }

    public async Task<List<Tag>> GetByNamesAsync(IEnumerable<string> names, CancellationToken cancellationToken)
    {
        var lowerNames = names.Select(n => n.ToLower()).ToList();

        return await DbSet
            .Where(t => lowerNames.Contains(t.Name.ToLower()))
            .ToListAsync(cancellationToken);
    }

    public async Task<(List<TagWithArticleCount> Tags, int TotalCount)> GetPopularTagsAsync(
        int page,
        int pageSize,
        CancellationToken cancellationToken)
    {
        // Query tags that have at least one published article, ordered by published article count
        var query = Context.Set<Article>()
            .Where(a => a.Status == ArticleStatus.Published)
            .SelectMany(a => a.Tags)
            .GroupBy(at => at.TagId)
            .Select(g => new { TagId = g.Key, Count = g.Count() });

        var totalCount = await query.CountAsync(cancellationToken);

        var tagCounts = await query
            .OrderByDescending(x => x.Count)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        var tagIds = tagCounts.Select(x => x.TagId).ToList();
        var countMap = tagCounts.ToDictionary(x => x.TagId, x => x.Count);

        var tags = await DbSet
            .Where(t => tagIds.Contains(t.Id))
            .ToListAsync(cancellationToken);

        // Preserve the order from tagCounts and include the article count
        var result = tagIds
            .Select(id =>
            {
                var tag = tags.First(t => t.Id == id);
                return new TagWithArticleCount(tag.Id, tag.Name, tag.Slug, countMap[id]);
            })
            .ToList();

        return (result, totalCount);
    }
}
