namespace Blog.Domain.Abstractions;

public sealed record Error
{
    public static readonly Error None = new(string.Empty, string.Empty);
    public static readonly Error NullValue = new("Error.NullValue", "Null value was provided");

    private Error(string code, string message)
    {
        Code = code;
        Message = message;
    }

    public string Code { get; }
    public string Message { get; }

    public static Error Failure(string code, string message) => new(code, message);

    public static implicit operator string(Error error) => error.Code;

    public override string ToString() => Code;
}