using FluentValidation;

namespace Blog.Application.Articles.CreateArticleDraft;

public sealed class CreateArticleDraftCommandValidator
    : AbstractValidator<CreateArticleDraftCommand>
{
    public CreateArticleDraftCommandValidator()
    {
        RuleFor(x => x.IdentityId)
            .NotEmpty()
            .WithMessage("Identity ID is required");

        RuleFor(x => x.Title)
            .NotEmpty()
            .WithMessage("Title is required")
            .MaximumLength(200)
            .WithMessage("Title must not exceed 200 characters");

        RuleFor(x => x.Subtitle)
            .MaximumLength(500)
            .WithMessage("Subtitle must not exceed 500 characters");

        RuleFor(x => x.Content)
            .NotEmpty()
            .WithMessage("Content is required");
    }
}