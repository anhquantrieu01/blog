using MyBlog.Application.Common.Interfaces;
using MyBlog.Application.Common.Models;

namespace MyBlog.Application.Auth.Commands.Login;

public record LoginCommand : IRequest<Result>
{
    public string Email { get; init; } = default!;
    public string Password { get; init; } = default!;
}

public class LoginCommandHandler : IRequestHandler<LoginCommand, Result>
{
    private readonly IIdentityService _identityService;

    public LoginCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<Result> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var result = await _identityService.PasswordSignInAsync(request.Email, request.Password);

        if (!result.Succeeded)
        {
            return Result.Failure(result.Errors);
        }

        return Result.Success();
    }
}
