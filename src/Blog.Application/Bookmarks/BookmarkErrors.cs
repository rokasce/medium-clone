using Blog.Domain.Abstractions;

namespace Blog.Application.Bookmarks;

public static class BookmarkErrors
{
    public static readonly Error AlreadyBookmarked = Error.Failure(
        "Bookmark.AlreadyBookmarked",
        "This article is already bookmarked");

    public static readonly Error NotFound = Error.Failure(
        "Bookmark.NotFound",
        "Bookmark not found");
}
