using Blog.Application.Common.Interfaces;
using Blog.Domain.Notifications;
using Blog.Domain.Notifications.ValueObjects;
using Blog.Domain.Reactions.Events;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Blog.Application.Notifications.Events;

public sealed class ArticleClapAddedHandler : INotificationHandler<ArticleClapAdded>
{
    private readonly INotificationRepository _notificationRepository;
    private readonly IArticleRepository _articleRepository;
    private readonly IUserRepository _userRepository;
    private readonly ILogger<ArticleClapAddedHandler> _logger;

    public ArticleClapAddedHandler(
        INotificationRepository notificationRepository,
        IArticleRepository articleRepository,
        IUserRepository userRepository,
        ILogger<ArticleClapAddedHandler> logger)
    {
        _notificationRepository = notificationRepository;
        _articleRepository = articleRepository;
        _userRepository = userRepository;
        _logger = logger;
    }

    public async Task Handle(ArticleClapAdded domainEvent, CancellationToken cancellationToken)
    {
        var article = await _articleRepository.GetByIdAsync(domainEvent.ArticleId, cancellationToken);

        if (article is null)
        {
            _logger.LogWarning("Article {ArticleId} not found for clap notification", domainEvent.ArticleId);
            return;
        }

        // Don't notify if the user clapped their own article
        if (article.Author.UserId == domainEvent.UserId)
        {
            return;
        }

        var clappingUser = await _userRepository.GetByIdAsync(domainEvent.UserId, cancellationToken);

        if (clappingUser is null)
        {
            _logger.LogWarning("User {UserId} not found for clap notification", domainEvent.UserId);
            return;
        }

        var notification = Notification.Create(
            userId: article.Author.UserId,
            type: NotificationType.ArticleClapped,
            title: "New claps on your article",
            message: $"{clappingUser.DisplayName} clapped {domainEvent.ClapsAdded} time{(domainEvent.ClapsAdded > 1 ? "s" : "")} for '{article.Title}'",
            actionUrl: $"/articles/{article.Slug}",
            relatedEntityId: article.Id,
            actorId: clappingUser.Id,
            actorName: clappingUser.DisplayName,
            actorAvatarUrl: clappingUser.AvatarUrl?.Value);

        await _notificationRepository.AddAsync(notification, cancellationToken);
        await _notificationRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Created clap notification for user {UserId} from {ActorId} on article {ArticleId}",
            article.Author.UserId,
            clappingUser.Id,
            article.Id);
    }
}
