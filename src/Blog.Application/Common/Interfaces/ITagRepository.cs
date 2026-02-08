using Blog.Domain.Articles;

namespace Blog.Application.Common.Interfaces;

public interface ITagRepository : IRepository<Tag>
{
    Task<Tag?> GetByNameAsync(string name, CancellationToken cancellationToken);
    Task<List<Tag>> GetByNamesAsync(IEnumerable<string> names, CancellationToken cancellationToken);
}
