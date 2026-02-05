using Blog.Domain.Users;

namespace Blog.Application.Common.Interfaces;

public interface IAuthorRepository : IRepository<Author>
{
    Task<Author?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken);
    Task<bool> ExistsByUserIdAsync(Guid userId, CancellationToken cancellationToken);
}
