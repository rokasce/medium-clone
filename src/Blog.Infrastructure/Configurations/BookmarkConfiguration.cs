using Blog.Domain.ReadingList;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Infrastructure.Configurations;

public sealed class BookmarkConfiguration : IEntityTypeConfiguration<Bookmark>
{
    public void Configure(EntityTypeBuilder<Bookmark> builder)
    {
        builder.ToTable("bookmarks");

        builder.HasKey(b => b.Id);

        builder.Property(b => b.Id)
            .ValueGeneratedNever();

        builder.Property(b => b.UserId)
            .IsRequired();

        builder.Property(b => b.ArticleId)
            .IsRequired();

        builder.Property(b => b.BookmarkedAt)
            .IsRequired();

        // Relationships
        builder.HasOne(b => b.User)
            .WithMany()
            .HasForeignKey(b => b.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(b => b.Article)
            .WithMany()
            .HasForeignKey(b => b.ArticleId)
            .OnDelete(DeleteBehavior.Cascade);

        // Ignore domain events
        builder.Ignore(b => b.DomainEvents);

        // Indexes - unique constraint for one bookmark per user per article
        builder.HasIndex(b => new { b.UserId, b.ArticleId })
            .IsUnique();

        builder.HasIndex(b => b.UserId);
        builder.HasIndex(b => b.ArticleId);
    }
}
