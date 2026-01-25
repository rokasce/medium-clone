using Blog.Domain.Articles;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Infrastructure.Configurations;

public sealed class ArticleTagConfiguration : IEntityTypeConfiguration<ArticleTag>
{
    public void Configure(EntityTypeBuilder<ArticleTag> builder)
    {
        builder.ToTable("article_tags");

        // Composite key
        builder.HasKey(at => new { at.ArticleId, at.TagId });

        builder.Property(at => at.ArticleId)
            .HasColumnName("article_id")
            .IsRequired();

        builder.Property(at => at.TagId)
            .HasColumnName("tag_id")
            .IsRequired();

        builder.Property(at => at.AddedAt)
            .HasColumnName("added_at")
            .IsRequired();

        // Relationships
        builder.HasOne(at => at.Article)
            .WithMany(a => a.Tags)
            .HasForeignKey(at => at.ArticleId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(at => at.Tag)
            .WithMany()
            .HasForeignKey(at => at.TagId)
            .OnDelete(DeleteBehavior.Restrict);

        // Ignore domain events
        builder.Ignore(at => at.DomainEvents);

        // Indexes
        builder.HasIndex(at => at.TagId)
            .HasDatabaseName("ix_article_tags_tag_id");
    }
}