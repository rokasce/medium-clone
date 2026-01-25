using System;
using Blog.Domain.Abstractions;
using Blog.Domain.Articles;
using Blog.Domain.Users;

namespace Blog.Domain.Analytics;

public sealed class ArticleView : Entity
{
    public Guid ArticleId { get; private set; }
    public Guid? UserId { get; private set; }
    public string IpAddress { get; private set; }
    public string UserAgent { get; private set; }
    public string? ReferrerUrl { get; private set; }
    public DateTime ViewedAt { get; private set; }

    // Navigation properties
    public Article Article { get; private set; }
    public User? User { get; private set; }
}
