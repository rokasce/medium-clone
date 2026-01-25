using Blog.Domain.Articles;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Infrastructure.Configurations;

public sealed class ArticleRevisionConfiguration : IEntityTypeConfiguration<ArticleRevision>
{
    public void Configure(EntityTypeBuilder<ArticleRevision> builder)
    {
        builder.ToTable("article_revisions");

        builder.HasKey(ar => ar.Id);

        builder.Property(ar => ar.Id)
            .HasColumnName("id")
            .ValueGeneratedNever();

        builder.Property(ar => ar.ArticleId)
            .HasColumnName("article_id")
            .IsRequired();

        builder.Property(ar => ar.Title)
            .HasColumnName("title")
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(ar => ar.Content)
            .HasColumnName("content")
            .HasColumnType("text")
            .IsRequired();

        builder.Property(ar => ar.Version)
            .HasColumnName("version")
            .IsRequired();

        builder.Property(ar => ar.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        // Relationship
        builder.HasOne(ar => ar.Article)
            .WithMany(a => a.Revisions)
            .HasForeignKey(ar => ar.ArticleId)
            .OnDelete(DeleteBehavior.Cascade);

        // Ignore domain events
        builder.Ignore(ar => ar.DomainEvents);

        // Indexes
        builder.HasIndex(ar => ar.ArticleId)
            .HasDatabaseName("ix_article_revisions_article_id");

        builder.HasIndex(ar => new { ar.ArticleId, ar.Version })
            .IsUnique()
            .HasDatabaseName("ix_article_revisions_article_version");
    }
}