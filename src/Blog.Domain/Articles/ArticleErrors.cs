using Blog.Domain.Abstractions;

namespace Blog.Domain.Articles;

public static class ArticleErrors
{
    public static readonly Error NotFound = Error.Failure(
        "Article.NotFound",
        "The article with the specified identifier was not found");

    public static readonly Error AlreadyPublished = Error.Failure(
        "Article.AlreadyPublished",
        "The article is already published");

    public static readonly Error CannotPublishDeleted = Error.Failure(
        "Article.CannotPublishDeleted",
        "Cannot publish a deleted article");

    public static readonly Error EmptyContent = Error.Failure(
        "Article.EmptyContent",
        "Cannot publish an article without content");

    public static readonly Error CannotUpdateDeleted = Error.Failure(
        "Article.CannotUpdateDeleted",
        "Cannot update a deleted article");

    public static readonly Error NotPublished = Error.Failure(
        "Article.NotPublished",
        "Only published articles can be unpublished");

    public static readonly Error Unauthorized = Error.Failure(
        "Article.Unauthorized",
        "You are not authorized to access this article");

    public static readonly Error CannotClapOwnArticle = Error.Failure(
        "Article.CannotClapOwnArticle",
        "You cannot clap for your own article");
}