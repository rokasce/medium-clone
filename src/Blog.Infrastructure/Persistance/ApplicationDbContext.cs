using Blog.Application.Common.Interfaces;
using Blog.Domain.Abstractions;
using Blog.Domain.Analytics;
using Blog.Domain.Articles;
using Microsoft.EntityFrameworkCore;

namespace Blog.Infrastructure.Persistance;

public sealed class ApplicationDbContext : DbContext
{
    private readonly IDomainEventDispatcher _eventDispatcher;

    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options,
        IDomainEventDispatcher eventDispatcher)
        : base(options)
    {
        _eventDispatcher = eventDispatcher;
    }

    // DbSets
    public DbSet<Article> Articles => Set<Article>();
    public DbSet<Tag> Tags => Set<Tag>();
    public DbSet<ArticleRevision> ArticleRevisions => Set<ArticleRevision>();
    public DbSet<ArticleStatistics> ArticleStatistics => Set<ArticleStatistics>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Automatically apply all IEntityTypeConfiguration implementations
        // from the current assembly (Infrastructure)
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

        base.OnModelCreating(modelBuilder);
    }

    public override async Task<int> SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        var entitiesWithEvents = ChangeTracker
            .Entries<IHasDomainEvents>()
            .Where(e => e.Entity.DomainEvents.Any())
            .Select(e => e.Entity)
            .ToList();

        var result = await base.SaveChangesAsync(cancellationToken);

        await _eventDispatcher.DispatchEventsAsync(
            entitiesWithEvents,
            cancellationToken);

        return result;
    }
}