using Blog.Domain.Comments;

namespace Blog.Application.Common.Interfaces;

public interface ICommentRepository : IRepository<Comment>
{
    Task<List<Comment>> GetByArticleIdAsync(Guid articleId, CancellationToken cancellationToken);
    Task<List<Comment>> GetRepliesAsync(Guid parentCommentId, CancellationToken cancellationToken);
    Task<int> GetCommentCountByArticleAsync(Guid articleId, CancellationToken cancellationToken);
}