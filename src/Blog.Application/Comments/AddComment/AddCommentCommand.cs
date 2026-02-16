using Blog.Domain.Abstractions;
using MediatR;

namespace Blog.Application.Comments.AddComment;

public sealed record AddCommentCommand(
    Guid ArticleId,
    string IdentityId,
    string Content,
    Guid? ParentCommentId = null) : IRequest<Result<Guid>>;
