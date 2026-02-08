using Blog.Application.Common.Interfaces;
using Blog.Domain.Articles;
using Blog.Domain.Articles.ValueObjects;
using Microsoft.EntityFrameworkCore;

namespace Blog.Infrastructure.Persistance.Repositories;

public sealed class ArticleRepository : Repository<Article>, IArticleRepository
{
    public ArticleRepository(ApplicationDbContext context) : base(context)
    {
    }

    public override async Task<Article?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken)
    {
        return await DbSet
            .Include(a => a.Tags)
                .ThenInclude(at => at.Tag)
            .Include(a => a.Revisions)
            .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
    }

    public async Task<Article?> GetBySlugAsync(
        string slug,
        CancellationToken cancellationToken)
    {
        return await DbSet
            .Include(a => a.Tags)
                .ThenInclude(at => at.Tag)
            .FirstOrDefaultAsync(a => a.Slug == slug, cancellationToken);
    }

    public async Task<List<Article>> GetByAuthorIdAsync(
        Guid authorId,
        CancellationToken cancellationToken)
    {
        return await DbSet
            .Include(a => a.Tags)
                .ThenInclude(at => at.Tag)
            .Where(a => a.AuthorId == authorId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Article>> GetPublishedArticlesAsync(
        int pageNumber,
        int pageSize,
        CancellationToken cancellationToken)
    {
        return await DbSet
            .Where(a => a.Status == ArticleStatus.Published)
            .OrderByDescending(a => a.PublishedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Article>> GetByTagAsync(
        Guid tagId,
        CancellationToken cancellationToken)
    {
        return await DbSet
            .Where(a => a.Tags.Any(t => t.TagId == tagId))
            .Where(a => a.Status == ArticleStatus.Published)
            .OrderByDescending(a => a.PublishedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<(List<Article> Articles, int TotalCount)> GetPublishedArticlesPagedAsync(
        int page,
        int pageSize,
        string? searchTerm,
        Guid? tagId,
        string? sortBy,
        CancellationToken cancellationToken)
    {
        var query = DbSet
            .Include(a => a.Author)
                .ThenInclude(author => author.User)
            .Include(a => a.Tags)
                .ThenInclude(at => at.Tag)
            .Where(a => a.Status == ArticleStatus.Published)
            .AsQueryable();

        // Search filter
        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.ToLower();
            query = query.Where(a =>
                a.Title.ToLower().Contains(term) ||
                a.Subtitle.ToLower().Contains(term));
        }

        // Tag filter
        if (tagId.HasValue)
        {
            query = query.Where(a => a.Tags.Any(t => t.TagId == tagId.Value));
        }

        // Get total count before pagination
        var totalCount = await query.CountAsync(cancellationToken);

        // Sorting
        query = sortBy?.ToLower() switch
        {
            "oldest" => query.OrderBy(a => a.PublishedAt),
            "title" => query.OrderBy(a => a.Title),
            _ => query.OrderByDescending(a => a.PublishedAt) // "latest" is default
        };

        // Pagination
        var articles = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (articles, totalCount);
    }
}