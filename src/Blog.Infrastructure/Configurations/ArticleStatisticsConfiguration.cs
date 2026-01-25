using Blog.Domain.Analytics;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Infrastructure.Configurations;

public sealed class ArticleStatisticsConfiguration
    : IEntityTypeConfiguration<ArticleStatistics>
{
    public void Configure(EntityTypeBuilder<ArticleStatistics> builder)
    {
        builder.ToTable("article_statistics");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.Id)
            .HasColumnName("id")
            .ValueGeneratedNever();

        builder.Property(s => s.ArticleId)
            .HasColumnName("article_id")
            .IsRequired();

        builder.HasIndex(s => s.ArticleId)
            .IsUnique()
            .HasDatabaseName("ix_article_statistics_article_id");

        builder.Property(s => s.ViewCount)
            .HasColumnName("view_count")
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(s => s.UniqueViewCount)
            .HasColumnName("unique_view_count")
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(s => s.ClapCount)
            .HasColumnName("clap_count")
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(s => s.CommentCount)
            .HasColumnName("comment_count")
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(s => s.LastUpdatedAt)
            .HasColumnName("last_updated_at")
            .IsRequired();

        // Ignore domain events
        builder.Ignore(s => s.DomainEvents);
    }
}