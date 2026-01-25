using Blog.Domain.Articles.Events;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Blog.Application.Articles.Events;

public sealed class ArticlePublishedHandler
    : INotificationHandler<ArticlePublished>
{
    private readonly ILogger<ArticlePublishedHandler> _logger;

    public ArticlePublishedHandler(ILogger<ArticlePublishedHandler> logger)
    {
        _logger = logger;
    }

    public Task Handle(
        ArticlePublished notification,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Article published: {ArticleId} - {Title} by Author {AuthorId}",
            notification.ArticleId,
            notification.Title,
            notification.AuthorId);

        // TODO: In future iterations:
        // - Notify followers
        // - Update search index
        // - Send email notifications
        // - Update analytics

        return Task.CompletedTask;
    }
}