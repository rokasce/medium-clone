using Blog.Domain.Reactions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Infrastructure.Configurations;

public sealed class ArticleClapConfiguration : IEntityTypeConfiguration<ArticleClap>
{
    public void Configure(EntityTypeBuilder<ArticleClap> builder)
    {
        builder.ToTable("article_claps");

        builder.HasKey(ac => ac.Id);

        builder.Property(ac => ac.Id)
            .ValueGeneratedNever();

        builder.Property(ac => ac.ArticleId)
            .IsRequired();

        builder.Property(ac => ac.UserId)
            .IsRequired();

        builder.Property(ac => ac.ClapCount)
            .IsRequired();

        builder.Property(ac => ac.CreatedAt)
            .IsRequired();

        builder.Property(ac => ac.LastClappedAt)
            .IsRequired();

        // Relationships
        builder.HasOne(ac => ac.Article)
            .WithMany()
            .HasForeignKey(ac => ac.ArticleId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ac => ac.User)
            .WithMany()
            .HasForeignKey(ac => ac.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Ignore domain events
        builder.Ignore(ac => ac.DomainEvents);

        // Indexes - unique constraint for one clap record per user per article
        builder.HasIndex(ac => new { ac.ArticleId, ac.UserId })
            .IsUnique();

        builder.HasIndex(ac => ac.ArticleId);
        builder.HasIndex(ac => ac.UserId);
    }
}
