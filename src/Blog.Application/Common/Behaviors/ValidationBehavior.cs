using FluentValidation;
using FluentValidation.Results;
using MediatR;

namespace Blog.Application.Common.Behaviors;

public sealed class ValidationBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (!_validators.Any())
        {
            return await next();
        }

        var context = new ValidationContext<TRequest>(request);

        var validationResults = await ValidateAsync(context, cancellationToken);

        var failures = GetFailures(validationResults);

        if (failures.Any())
        {
            throw new ValidationException(failures);
        }

        return await next();
    }

    private async Task<ValidationResult[]> ValidateAsync(
        ValidationContext<TRequest> context,
        CancellationToken cancellationToken)
    {
        var tasks = _validators
            .Select(v => v.ValidateAsync(context, cancellationToken));

        return await Task.WhenAll(tasks);
    }

    private static List<ValidationFailure> GetFailures(
        ValidationResult[] results)
    {
        return results
            .SelectMany(r => r.Errors)
            .Where(f => f != null)
            .ToList();
    }
}
