using Blog.Application.Common.Interfaces;
using Blog.Domain.Abstractions;
using Blog.Domain.Articles;
using MediatR;

namespace Blog.Application.Articles.PublishArticleCommand;

public sealed class PublishArticleCommandHandler
    : IRequestHandler<PublishArticleCommand, Result>
{
    private readonly IArticleRepository _repository;

    public PublishArticleCommandHandler(IArticleRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result> Handle(
        PublishArticleCommand request,
        CancellationToken cancellationToken)
    {
        var article = await _repository.GetByIdAsync(
            request.ArticleId,
            cancellationToken);

        if (article is null)
        {
            return Result.Failure(ArticleErrors.NotFound);
        }

        var publishResult = article.Publish();

        if (publishResult.IsFailure)
        {
            return publishResult;
        }

        _repository.Update(article);
        await _repository.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}