using Blog.Domain.Reactions;
using FluentValidation;

namespace Blog.Application.Articles.ClapArticle;

public sealed class ClapArticleCommandValidator : AbstractValidator<ClapArticleCommand>
{
    public ClapArticleCommandValidator()
    {
        RuleFor(x => x.ArticleId)
            .NotEmpty();

        RuleFor(x => x.IdentityId)
            .NotEmpty();

        RuleFor(x => x.ClapCount)
            .GreaterThan(0)
            .LessThanOrEqualTo(ArticleClap.MaxClapsPerUser)
            .WithMessage($"Clap count must be between 1 and {ArticleClap.MaxClapsPerUser}");
    }
}
