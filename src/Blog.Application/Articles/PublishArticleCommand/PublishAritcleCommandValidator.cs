using FluentValidation;

namespace Blog.Application.Articles.PublishArticleCommand;

public sealed class PublishArticleCommandValidator
    : AbstractValidator<PublishArticleCommand>
{
    public PublishArticleCommandValidator()
    {
        RuleFor(x => x.ArticleId)
            .NotEmpty()
            .WithMessage("Article ID is required");
    }
}