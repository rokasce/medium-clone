using FluentValidation;

namespace Blog.Application.Bookmarks.AddBookmark;

public sealed class AddBookmarkCommandValidator : AbstractValidator<AddBookmarkCommand>
{
    public AddBookmarkCommandValidator()
    {
        RuleFor(x => x.ArticleId)
            .NotEmpty()
            .WithMessage("Article ID is required");

        RuleFor(x => x.IdentityId)
            .NotEmpty()
            .WithMessage("Identity ID is required");
    }
}
