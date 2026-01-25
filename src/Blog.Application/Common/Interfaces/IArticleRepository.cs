using Blog.Domain.Articles;

namespace Blog.Application.Common.Interfaces;

public interface IArticleRepository : IRepository<Article>
{
    Task<Article?> GetBySlugAsync(string slug, CancellationToken cancellationToken);
    Task<List<Article>> GetByAuthorIdAsync(Guid authorId, CancellationToken cancellationToken);
    Task<List<Article>> GetPublishedArticlesAsync(int pageNumber, int pageSize, CancellationToken cancellationToken);
    Task<List<Article>> GetByTagAsync(Guid tagId, CancellationToken cancellationToken);
}
