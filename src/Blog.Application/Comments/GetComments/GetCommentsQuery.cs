using Blog.Domain.Abstractions;
using MediatR;

namespace Blog.Application.Comments.GetComments;

public sealed record GetCommentsQuery(Guid ArticleId) : IRequest<Result<List<CommentResponse>>>;

public sealed record CommentResponse(
    Guid Id,
    Guid ArticleId,
    Guid AuthorId,
    string AuthorName,
    string? AuthorAvatarUrl,
    string Content,
    string Status,
    int LikeCount,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    List<CommentResponse> Replies);