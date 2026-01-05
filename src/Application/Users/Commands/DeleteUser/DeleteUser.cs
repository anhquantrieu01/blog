using MediatR;
using MyBlog.Application.Common.Interfaces;
using MyBlog.Application.Common.Models;

namespace MyBlog.Application.Users.Commands.DeleteUser;

public record DeleteUserCommand(string Id) : IRequest<Result>;

public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, Result>
{
    private readonly IIdentityService _identityService;

    public DeleteUserCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<Result> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        return await _identityService.DeleteUserAsync(request.Id);
    }
}
