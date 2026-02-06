using Blog.Domain.Articles;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Infrastructure.Configurations;

public sealed class ArticleConfiguration : IEntityTypeConfiguration<Article>
{
    public void Configure(EntityTypeBuilder<Article> builder)
    {
        builder.HasKey(a => a.Id);

        builder.Property(a => a.Id)
            .ValueGeneratedNever();

        builder.Property(a => a.AuthorId)
            .IsRequired();

        builder.Property(a => a.Title)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(a => a.Slug)
            .HasMaxLength(250)
            .IsRequired();

        builder.HasIndex(a => a.Slug)
            .IsUnique();

        builder.Property(a => a.Subtitle)
            .HasMaxLength(500);

        builder.Property(a => a.Content)
            .HasColumnType("text")
            .IsRequired();

        builder.Property(a => a.FeaturedImageUrl)
            .HasMaxLength(1000);

        builder.Property(a => a.Status)
            .HasConversion<int>()
            .IsRequired();

        builder.Property(a => a.ReadingTimeMinutes)
            .IsRequired();

        builder.Property(a => a.CreatedAt)
            .IsRequired();

        // Relationships
        builder.HasMany(a => a.Tags)
            .WithOne(at => at.Article)
            .HasForeignKey(at => at.ArticleId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(a => a.Revisions)
            .WithOne(ar => ar.Article)
            .HasForeignKey(ar => ar.ArticleId)
            .OnDelete(DeleteBehavior.Cascade);

        // Ignore domain events (not persisted)
        builder.Ignore(a => a.DomainEvents);

        // Indexes for common queries
        builder.HasIndex(a => a.AuthorId);
        builder.HasIndex(a => a.PublicationId);
        builder.HasIndex(a => a.Status);
        builder.HasIndex(a => a.PublishedAt);
    }
}
