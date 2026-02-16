using Blog.Domain.Abstractions;
using MediatR;

namespace Blog.Application.Comments.DeleteComment;

public sealed record DeleteCommentCommand(
    Guid CommentId,
    string IdentityId) : IRequest<Result>;
