using FluentValidation;

namespace Blog.Application.Bookmarks.RemoveBookmark;

public sealed class RemoveBookmarkCommandValidator : AbstractValidator<RemoveBookmarkCommand>
{
    public RemoveBookmarkCommandValidator()
    {
        RuleFor(x => x.ArticleId)
            .NotEmpty()
            .WithMessage("Article ID is required");

        RuleFor(x => x.IdentityId)
            .NotEmpty()
            .WithMessage("Identity ID is required");
    }
}
