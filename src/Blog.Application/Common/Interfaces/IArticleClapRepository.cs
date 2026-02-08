using Blog.Domain.Reactions;

namespace Blog.Application.Common.Interfaces;

public interface IArticleClapRepository : IRepository<ArticleClap>
{
    Task<ArticleClap?> GetByArticleAndUserAsync(Guid articleId, Guid userId, CancellationToken cancellationToken);
    Task<int> GetTotalClapsForArticleAsync(Guid articleId, CancellationToken cancellationToken);
    Task<int> GetUserClapsForArticleAsync(Guid articleId, Guid userId, CancellationToken cancellationToken);
    Task<Dictionary<Guid, int>> GetTotalClapsForArticlesAsync(IEnumerable<Guid> articleIds, CancellationToken cancellationToken);
}
