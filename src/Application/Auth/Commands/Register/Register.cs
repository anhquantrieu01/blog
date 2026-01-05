using MyBlog.Application.Common.Interfaces;
using MyBlog.Application.Common.Models;

namespace MyBlog.Application.Auth.Commands.Register;

public record RegisterCommand : IRequest<Result>
{
    public string FullName { get; init; } = default!;
    public string Email { get; init; } = default!;
    public string Password { get; init; } = default!;
}

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, Result>
{
    private readonly IIdentityService _identityService;

    public RegisterCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<Result> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var result = await _identityService.RegisterUserAsync(request.FullName, request.Email, request.Password);

        if (!result.Succeeded)
        {
            return Result.Failure(result.Errors);
        }

        return Result.Success();
    }
}
