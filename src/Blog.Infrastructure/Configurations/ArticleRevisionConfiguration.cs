using Blog.Domain.Articles;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Infrastructure.Configurations;

public sealed class ArticleRevisionConfiguration : IEntityTypeConfiguration<ArticleRevision>
{
    public void Configure(EntityTypeBuilder<ArticleRevision> builder)
    {
        builder.HasKey(ar => ar.Id);

        builder.Property(ar => ar.Id)
            .ValueGeneratedNever();

        builder.Property(ar => ar.ArticleId)
            .IsRequired();

        builder.Property(ar => ar.Title)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(ar => ar.Content)
            .HasColumnType("text")
            .IsRequired();

        builder.Property(ar => ar.Version)
            .IsRequired();

        builder.Property(ar => ar.CreatedAt)
            .IsRequired();

        // Relationship
        builder.HasOne(ar => ar.Article)
            .WithMany(a => a.Revisions)
            .HasForeignKey(ar => ar.ArticleId)
            .OnDelete(DeleteBehavior.Cascade);

        // Ignore domain events
        builder.Ignore(ar => ar.DomainEvents);

        // Indexes
        builder.HasIndex(ar => ar.ArticleId);

        builder.HasIndex(ar => new { ar.ArticleId, ar.Version })
            .IsUnique();
    }
}
