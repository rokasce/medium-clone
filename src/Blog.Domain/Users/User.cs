using System.ComponentModel.DataAnnotations.Schema;
using Blog.Domain.Abstractions;
using Blog.Domain.Common.ValueObjects;
using Blog.Domain.Users.ValueObjects;

namespace Blog.Domain.Users;

public sealed class User : Entity
{
    private User(Guid id, Email email, Username username)
        : base(id)
    {
        Email = email;
        Username = username;
        CreatedAt = DateTime.UtcNow;
        DisplayName = username.Value;
        IsVerified = true;
    }

    private User() { }

    private readonly List<UserFollower> _followers = new();
    private readonly List<UserFollower> _following = new();

    public Email Email { get; private set; }
    public Username Username { get; private set; }
    public string DisplayName { get; private set; } = string.Empty;
    public string? Bio { get; private set; }
    public ImageUrl? AvatarUrl { get; private set; }
    public bool IsVerified { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? LastActiveAt { get; private set; }
    public string IdentityId { get; private set; } = string.Empty;

    public static Result<User> Create(string email, string username)
    {
        var emailResult = Email.Create(email);
        if (emailResult.IsFailure)
        {
            return Result.Failure<User>(emailResult.Error);
        }

        var usernameResult = Username.Create(username);
        if (usernameResult.IsFailure)
        {
            return Result.Failure<User>(usernameResult.Error);
        }

        var user = new User(Guid.NewGuid(), emailResult.Value, usernameResult.Value);

        return Result.Success(user);
    }

    public void SetIdentityId(string identityId)
    {
        IdentityId = identityId;
    }

    public Result SetAvatarUrl(string avatarUrl)
    {
        var result = ImageUrl.Create(avatarUrl);
        if (result.IsFailure)
        {
            return Result.Failure(result.Error);
        }

        AvatarUrl = result.Value;
        return Result.Success();
    }

    public void RemoveAvatarUrl()
    {
        AvatarUrl = null;
    }

    [NotMapped]
    public IReadOnlyList<UserFollower> Followers => _followers.AsReadOnly();
    [NotMapped]
    public IReadOnlyList<UserFollower> Following => _following.AsReadOnly();
}
