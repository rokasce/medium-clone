namespace Blog.Application.Common.Pagination;

public sealed record PaginationParams
{
    private const int MaxPageSize = 50;
    private const int DefaultPageSize = 10;

    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = DefaultPageSize;

    public int GetPage() => Math.Max(1, Page);
    public int GetPageSize() => Math.Clamp(PageSize, 1, MaxPageSize);
    public int GetSkip() => (GetPage() - 1) * GetPageSize();
}

public sealed record PagedResult<T>
{
    public required List<T> Items { get; init; }
    public required int Page { get; init; }
    public required int PageSize { get; init; }
    public required int TotalCount { get; init; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasPreviousPage => Page > 1;
    public bool HasNextPage => Page < TotalPages;
}
