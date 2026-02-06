using Blog.Domain.Articles.ValueObjects;
using Blog.Domain.Comments.ValueObjects;
using Blog.Domain.Publications.ValueObjects;
using Blog.Domain.Users.ValueObjects;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Blog.Infrastructure.Persistance.Converters;

public sealed class ArticleIdConverter : ValueConverter<ArticleId, Guid>
{
    public ArticleIdConverter()
        : base(
            id => id.Value,
            guid => ArticleId.From(guid))
    {
    }
}

public sealed class TagIdConverter : ValueConverter<TagId, Guid>
{
    public TagIdConverter()
        : base(
            id => id.Value,
            guid => TagId.From(guid))
    {
    }
}

public sealed class UserIdConverter : ValueConverter<UserId, Guid>
{
    public UserIdConverter()
        : base(
            id => id.Value,
            guid => UserId.From(guid))
    {
    }
}

public sealed class AuthorIdConverter : ValueConverter<AuthorId, Guid>
{
    public AuthorIdConverter()
        : base(
            id => id.Value,
            guid => AuthorId.From(guid))
    {
    }
}

public sealed class PublicationIdConverter : ValueConverter<PublicationId, Guid>
{
    public PublicationIdConverter()
        : base(
            id => id.Value,
            guid => PublicationId.From(guid))
    {
    }
}

public sealed class CommentIdConverter : ValueConverter<CommentId, Guid>
{
    public CommentIdConverter()
        : base(
            id => id.Value,
            guid => CommentId.From(guid))
    {
    }
}

public sealed class NullablePublicationIdConverter : ValueConverter<PublicationId?, Guid?>
{
    public NullablePublicationIdConverter()
        : base(
            id => id.HasValue ? id.Value.Value : null,
            guid => guid.HasValue ? PublicationId.From(guid.Value) : null)
    {
    }
}
