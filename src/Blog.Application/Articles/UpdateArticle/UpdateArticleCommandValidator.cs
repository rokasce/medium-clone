using FluentValidation;

namespace Blog.Application.Articles.UpdateArticle;

public sealed class UpdateArticleCommandValidator : AbstractValidator<UpdateArticleCommand>
{
    private const int MaxTagsCount = 10;
    private const int MaxTagNameLength = 50;

    public UpdateArticleCommandValidator()
    {
        RuleFor(x => x.ArticleId)
            .NotEmpty();

        RuleFor(x => x.IdentityId)
            .NotEmpty();

        RuleFor(x => x.Title)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Subtitle)
            .MaximumLength(500);

        RuleFor(x => x.Content)
            .NotEmpty();

        RuleFor(x => x.FeaturedImageUrl)
            .MaximumLength(1000)
            .When(x => !string.IsNullOrEmpty(x.FeaturedImageUrl));

        RuleFor(x => x.Tags)
            .Must(tags => tags.Count <= MaxTagsCount)
            .WithMessage($"Cannot have more than {MaxTagsCount} tags");

        RuleForEach(x => x.Tags)
            .NotEmpty()
            .MaximumLength(MaxTagNameLength);
    }
}
