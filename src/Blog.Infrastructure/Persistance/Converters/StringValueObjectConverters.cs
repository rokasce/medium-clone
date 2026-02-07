using Blog.Domain.Common.ValueObjects;
using Blog.Domain.Users.ValueObjects;
using Microsoft.EntityFrameworkCore.ChangeTracking;
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

public sealed class EmailComparer : ValueComparer<Email>
{
    public EmailComparer()
        : base(
            (e1, e2) => e1.Value == e2.Value,
            e => e.Value.GetHashCode(),
            e => e)
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

public sealed class UsernameComparer : ValueComparer<Username>
{
    public UsernameComparer()
        : base(
            (u1, u2) => u1.Value == u2.Value,
            u => u.Value.GetHashCode(),
            u => u)
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

public sealed class SlugComparer : ValueComparer<Slug>
{
    public SlugComparer()
        : base(
            (s1, s2) => s1.Value == s2.Value,
            s => s.Value.GetHashCode(),
            s => s)
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

public sealed class ImageUrlComparer : ValueComparer<ImageUrl>
{
    public ImageUrlComparer()
        : base(
            (i1, i2) => i1.Value == i2.Value,
            i => i.Value.GetHashCode(),
            i => i)
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
