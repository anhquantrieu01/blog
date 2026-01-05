using MediatR;
using MyBlog.Application.Common.Interfaces;
using MyBlog.Application.Common.Models;
namespace MyBlog.Application.Users.Commands.ChangePassword;
public record ChangePasswordCommand(
    string Id,
    string CurrentPassword,
    string NewPassword
) : IRequest<Result>;
public class ChangePasswordCommandHandler
    : IRequestHandler<ChangePasswordCommand, Result>
{
    private readonly IIdentityService _identityService;

    public ChangePasswordCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<Result> Handle(
        ChangePasswordCommand request,
        CancellationToken cancellationToken)
    {
        return await _identityService.ChangePasswordAsync(
            request.Id,
            request.CurrentPassword,
            request.NewPassword
        );
    }
}
