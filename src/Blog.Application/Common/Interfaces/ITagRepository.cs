using Blog.Domain.Articles;

namespace Blog.Application.Common.Interfaces;

public interface ITagRepository : IRepository<Tag>
{
    Task<Tag?> GetByNameAsync(string name, CancellationToken cancellationToken);
    Task<List<Tag>> GetByNamesAsync(IEnumerable<string> names, CancellationToken cancellationToken);
    Task<(List<TagWithArticleCount> Tags, int TotalCount)> GetPopularTagsAsync(int page, int pageSize, CancellationToken cancellationToken);
}

public sealed record TagWithArticleCount(Guid Id, string Name, string Slug, int ArticleCount);
