using Blog.Application.Common.Interfaces;
using Blog.Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace Blog.Infrastructure.Persistance.Repositories;

public sealed class AuthorRepository : Repository<Author>, IAuthorRepository
{
    public AuthorRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Author?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken)
    {
        return await DbSet
            .FirstOrDefaultAsync(a => a.UserId == userId, cancellationToken);
    }

    public async Task<bool> ExistsByUserIdAsync(Guid userId, CancellationToken cancellationToken)
    {
        return await DbSet
            .AnyAsync(a => a.UserId == userId, cancellationToken);
    }
}