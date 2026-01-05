using MediatR;
using MyBlog.Application.Common.Interfaces;
using MyBlog.Application.Common.Models;
using MyBlog.Application.Users.Dto;
namespace MyBlog.Application.Users.Commands.CreateUser;

public record CreateUserCommand(string? FullName, string Email, string Password, string? AvatarUrl, string? AvatarPublicId) : IRequest<UserDto>;

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, UserDto>
{
    private readonly IIdentityService _identityService;

    public CreateUserCommandHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<UserDto> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        
        var result = await _identityService.RegisterUserAsync(request.FullName, request.Email, request.Password, request.AvatarUrl, request.AvatarPublicId);

        if (!result.Succeeded)
        {
            throw new ApplicationException(string.Join("; ", result.Errors));
        }

        var createdUser = await _identityService.GetAllUsersAsync();
        var userDto = createdUser
            .FirstOrDefault(u => u.Email == request.Email);

        if (userDto == null)
            throw new ApplicationException("User created but not found.");

        return userDto;
    }
}
