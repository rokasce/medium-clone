using Blog.Domain.Common.ValueObjects;
using Blog.Domain.Users.ValueObjects;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Blog.Infrastructure.Persistance.Converters;

public sealed class EmailConverter : ValueConverter<Email, string>
{
    public EmailConverter()
        : base(
            email => email.Value,
            str => Email.Create(str).Value)
    {
    }
}

public sealed class UsernameConverter : ValueConverter<Username, string>
{
    public UsernameConverter()
        : base(
            username => username.Value,
            str => Username.Create(str).Value)
    {
    }
}

public sealed class SlugConverter : ValueConverter<Slug, string>
{
    public SlugConverter()
        : base(
            slug => slug.Value,
            str => Slug.Create(str).Value)
    {
    }
}

public sealed class ImageUrlConverter : ValueConverter<ImageUrl, string>
{
    public ImageUrlConverter()
        : base(
            url => url.Value,
            str => ImageUrl.Create(str).Value)
    {
    }
}

public sealed class NullableImageUrlConverter : ValueConverter<ImageUrl?, string?>
{
    public NullableImageUrlConverter()
        : base(
            url => url.HasValue ? url.Value.Value : null,
            str => string.IsNullOrEmpty(str) ? null : ImageUrl.Create(str).Value)
    {
    }
}
