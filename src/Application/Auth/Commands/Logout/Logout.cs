using MyBlog.Application.Common.Interfaces;
using MyBlog.Application.Common.Models;

namespace MyBlog.Application.Auth.Commands.Logout;

public record LogoutCommand : IRequest<Result>;

public class LogoutCommandHandler : IRequestHandler<LogoutCommand, Result>
{
    private readonly IIdentityService _identityService;

    public LogoutCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<Result> Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        // Gọi phương thức đăng xuất trong IdentityService
        return await _identityService.SignOutAsync();
    }
}
