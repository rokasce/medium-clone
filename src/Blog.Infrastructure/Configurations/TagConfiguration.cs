using Blog.Domain.Articles;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Blog.Infrastructure.Configurations;

public sealed class TagConfiguration : IEntityTypeConfiguration<Tag>
{
    public void Configure(EntityTypeBuilder<Tag> builder)
    {
        builder.ToTable("tags");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Id)
            .HasColumnName("id")
            .ValueGeneratedNever();

        builder.Property(t => t.Name)
            .HasColumnName("name")
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(t => t.Slug)
            .HasColumnName("slug")
            .HasMaxLength(60)
            .IsRequired();

        builder.HasIndex(t => t.Slug)
            .IsUnique()
            .HasDatabaseName("ix_tags_slug");

        builder.Property(t => t.ArticleCount)
            .HasColumnName("article_count")
            .IsRequired()
            .HasDefaultValue(0);

        // Ignore domain events and navigation collections
        builder.Ignore(t => t.DomainEvents);
        builder.Ignore(t => t.Articles);
    }
}