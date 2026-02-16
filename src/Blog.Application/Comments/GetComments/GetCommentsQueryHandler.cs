using Blog.Application.Common.Interfaces;
using Blog.Domain.Abstractions;
using Blog.Domain.Comments;
using MediatR;

namespace Blog.Application.Comments.GetComments;

internal sealed class GetCommentsQueryHandler
    : IRequestHandler<GetCommentsQuery, Result<List<CommentResponse>>>
{
    private readonly ICommentRepository _commentRepository;

    public GetCommentsQueryHandler(ICommentRepository commentRepository)
    {
        _commentRepository = commentRepository;
    }

    public async Task<Result<List<CommentResponse>>> Handle(
        GetCommentsQuery request,
        CancellationToken cancellationToken)
    {
        var comments = await _commentRepository.GetByArticleIdAsync(
            request.ArticleId,
            cancellationToken);

        var responses = new List<CommentResponse>();

        foreach (var comment in comments)
        {
            var replies = await _commentRepository.GetRepliesAsync(comment.Id, cancellationToken);

            var replyResponses = replies.Select(r => MapToResponse(r, [])).ToList();

            responses.Add(MapToResponse(comment, replyResponses));
        }

        return Result.Success(responses);
    }

    private static CommentResponse MapToResponse(Comment comment, List<CommentResponse> replies)
    {
        return new CommentResponse(
            comment.Id,
            comment.ArticleId,
            comment.AuthorId,
            comment.Author.User.DisplayName,
            comment.Author.User.AvatarUrl?.Value,
            comment.Content,
            comment.Status.ToString(),
            comment.LikeCount,
            comment.CreatedAt,
            comment.UpdatedAt,
            replies);
    }
}
