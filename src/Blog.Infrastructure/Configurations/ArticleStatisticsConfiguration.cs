using Blog.Domain.Analytics;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Infrastructure.Configurations;

public sealed class ArticleStatisticsConfiguration
    : IEntityTypeConfiguration<ArticleStatistics>
{
    public void Configure(EntityTypeBuilder<ArticleStatistics> builder)
    {
        builder.HasKey(s => s.Id);

        builder.Property(s => s.Id)
            .ValueGeneratedNever();

        builder.Property(s => s.ArticleId)
            .IsRequired();

        builder.HasIndex(s => s.ArticleId)
            .IsUnique();

        builder.Property(s => s.ViewCount)
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(s => s.UniqueViewCount)
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(s => s.ClapCount)
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(s => s.CommentCount)
            .IsRequired()
            .HasDefaultValue(0);

        builder.Property(s => s.LastUpdatedAt)
            .IsRequired();

        // Ignore domain events
        builder.Ignore(s => s.DomainEvents);
    }
}
