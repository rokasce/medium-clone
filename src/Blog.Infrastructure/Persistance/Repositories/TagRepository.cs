using Blog.Application.Common.Interfaces;
using Blog.Domain.Articles;
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
}
