using Blog.Domain.Articles;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Infrastructure.Configurations;

public sealed class ArticleConfiguration : IEntityTypeConfiguration<Article>
{
    public void Configure(EntityTypeBuilder<Article> builder)
    {
        builder.ToTable("articles");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.Id)
            .HasColumnName("id")
            .ValueGeneratedNever();

        builder.Property(a => a.AuthorId)
            .HasColumnName("author_id")
            .IsRequired();

        builder.Property(a => a.PublicationId)
            .HasColumnName("publication_id");

        builder.Property(a => a.Title)
            .HasColumnName("title")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(a => a.Slug)
            .HasColumnName("slug")
            .HasMaxLength(250)
            .IsRequired();

        builder.HasIndex(a => a.Slug)
            .IsUnique()
            .HasDatabaseName("ix_articles_slug");

        builder.Property(a => a.Subtitle)
            .HasColumnName("subtitle")
            .HasMaxLength(500);

        builder.Property(a => a.Content)
            .HasColumnName("content")
            .HasColumnType("text")
            .IsRequired();

        builder.Property(a => a.FeaturedImageUrl)
            .HasColumnName("featured_image_url")
            .HasMaxLength(1000);

        builder.Property(a => a.Status)
            .HasColumnName("status")
            .HasConversion<int>()
            .IsRequired();

        builder.Property(a => a.ReadingTimeMinutes)
            .HasColumnName("reading_time_minutes")
            .IsRequired();

        builder.Property(a => a.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(a => a.PublishedAt)
            .HasColumnName("published_at");

        builder.Property(a => a.UpdatedAt)
            .HasColumnName("updated_at");

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
        builder.HasIndex(a => a.AuthorId)
            .HasDatabaseName("ix_articles_author_id");

        builder.HasIndex(a => a.PublicationId)
            .HasDatabaseName("ix_articles_publication_id");

        builder.HasIndex(a => a.Status)
            .HasDatabaseName("ix_articles_status");

        builder.HasIndex(a => a.PublishedAt)
            .HasDatabaseName("ix_articles_published_at");
    }
}
