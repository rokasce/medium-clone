using Blog.Domain.Articles;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Infrastructure.Configurations;

public sealed class ArticleTagConfiguration : IEntityTypeConfiguration<ArticleTag>
{
    public void Configure(EntityTypeBuilder<ArticleTag> builder)
    {
        // Composite key
        builder.HasKey(at => new { at.ArticleId, at.TagId });

        builder.Property(at => at.ArticleId)
            .IsRequired();

        builder.Property(at => at.TagId)
            .IsRequired();

        builder.Property(at => at.AddedAt)
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
        builder.HasIndex(at => at.TagId);
    }
}
