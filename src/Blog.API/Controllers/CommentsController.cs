using Blog.Application.Comments.AddComment;
using Blog.Application.Comments.DeleteComment;
using Blog.Application.Comments.GetComments;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Blog.API.Controllers;

[Route("api/articles/{articleId:guid}/comments")]
public sealed class CommentsController : ApiControllerBase
{
    private readonly ISender _sender;

    public CommentsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    [ProducesResponseType(typeof(List<CommentResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetComments(
        Guid articleId,
        CancellationToken cancellationToken)
    {
        var query = new GetCommentsQuery(articleId);
        var result = await _sender.Send(query, cancellationToken);

        if (result.IsFailure)
        {
            return BadRequest(new ErrorResponse(result.Error.Code, result.Error.Message));
        }

        return Ok(result.Value);
    }

    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(Guid), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> AddComment(
        Guid articleId,
        [FromBody] AddCommentRequest request,
        CancellationToken cancellationToken)
    {
        var identityId = GetCurrentIdentityId();
        if (identityId is null) return Unauthorized();

        var command = new AddCommentCommand(articleId, identityId, request.Content, request.ParentCommentId);
        var result = await _sender.Send(command, cancellationToken);

        if (result.IsFailure)
        {
            return result.Error.Code switch
            {
                "Comment.NestingTooDeep" => BadRequest(new ErrorResponse(result.Error.Code, result.Error.Message)),
                "Comment.NotFound" => NotFound(new ErrorResponse(result.Error.Code, result.Error.Message)),
                _ => BadRequest(new ErrorResponse(result.Error.Code, result.Error.Message))
            };
        }

        return CreatedAtAction(nameof(GetComments), new { articleId }, result.Value);
    }

    [HttpDelete("{commentId:guid}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> DeleteComment(
        Guid articleId,
        Guid commentId,
        CancellationToken cancellationToken)
    {
        var identityId = GetCurrentIdentityId();
        if (identityId is null) return Unauthorized();

        var command = new DeleteCommentCommand(commentId, identityId);
        var result = await _sender.Send(command, cancellationToken);

        if (result.IsFailure)
        {
            return result.Error.Code switch
            {
                "Comment.NotFound" => NotFound(new ErrorResponse(result.Error.Code, result.Error.Message)),
                "Comment.Unauthorized" => StatusCode(StatusCodes.Status403Forbidden,
                    new ErrorResponse(result.Error.Code, result.Error.Message)),
                _ => BadRequest(new ErrorResponse(result.Error.Code, result.Error.Message))
            };
        }

        return NoContent();
    }
}

public sealed record AddCommentRequest(string Content, Guid? ParentCommentId = null);
