using MediatR;
using Microsoft.Extensions.Logging;

namespace Blog.Application.Common.Behaviors;

//public sealed class TransactionBehavior<TRequest, TResponse>
//    : IPipelineBehavior<TRequest, TResponse>
//    where TRequest : IRequest<TResponse>
//{
//    private readonly ApplicationDbContext _dbContext;
//    private readonly ILogger<TransactionBehavior<TRequest, TResponse>> _logger;

//    public TransactionBehavior(
//        ApplicationDbContext dbContext,
//        ILogger<TransactionBehavior<TRequest, TResponse>> logger)
//    {
//        _dbContext = dbContext;
//        _logger = logger;
//    }

//    public async Task<TResponse> Handle(
//        TRequest request,
//        RequestHandlerDelegate<TResponse> next,
//        CancellationToken cancellationToken)
//    {
//        if (IsNotCommand())
//        {
//            return await next();
//        }

//        return await ExecuteInTransactionAsync(next, cancellationToken);
//    }

//    private bool IsNotCommand()
//    {
//        var requestType = typeof(TRequest).Name;
//        return requestType.EndsWith("Query");
//    }

//    private async Task<TResponse> ExecuteInTransactionAsync(
//        RequestHandlerDelegate<TResponse> next,
//        CancellationToken cancellationToken)
//    {
//        var strategy = _dbContext.Database.CreateExecutionStrategy();

//        return await strategy.ExecuteAsync(async () =>
//        {
//            await using var transaction = await _dbContext.Database
//                .BeginTransactionAsync(cancellationToken);

//            try
//            {
//                var response = await next();
//                await transaction.CommitAsync(cancellationToken);
//                return response;
//            }
//            catch
//            {
//                await transaction.RollbackAsync(cancellationToken);
//                throw;
//            }
//        });
//    }
//}
