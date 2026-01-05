using MediatR;
using MyBlog.Application.Common.Interfaces;
using MyBlog.Application.Common.Models;
using MyBlog.Application.Users.Dto;
namespace MyBlog.Application.Users.Commands.UpdateUser;

public record UpdateUserCommand(string Id, string FullName, string Email, string? AvatarUrl = null, string? AvatarPublicId = null, List<string>? Roles = null) : IRequest<UserDto>;

public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, UserDto>
{
    private readonly IIdentityService _identityService;

    public UpdateUserCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<UserDto> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var updated = await _identityService.UpdateUserAsync(
            userId: request.Id,
            fullName: request.FullName,
            email: request.Email,
            avatarUrl: request.AvatarUrl, 
            avatarPublicId: request.AvatarPublicId,
            roles: request.Roles 
        );
        return updated;
    }
}
