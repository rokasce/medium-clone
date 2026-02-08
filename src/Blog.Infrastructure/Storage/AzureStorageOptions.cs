namespace Blog.Infrastructure.Storage;

public sealed class AzureStorageOptions
{
    public const string SectionName = "AzureStorage";

    public string ConnectionString { get; init; } = string.Empty;
    public string BaseUrl { get; init; } = string.Empty;
}
