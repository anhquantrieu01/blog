using MediatR;
using MyBlog.Application.Common.Interfaces;

namespace MyBlog.Application.Auth.Queries.GetCurrentUser;

public record GetCurrentUser : IRequest<CurrentUserDto?>;
public class CurrentUserDto
{
    public string? Id { get; set; }
    public string? Email { get; set; }
    public string? UserName { get; set; }
    public string? FullName { get; set; }
    public string? AvatarUrl { get; set; }
    public string? AvatarPublicId { get; set; }
    public List<string> Roles { get; set; } = new();
}

public class GetCurrentUserHandler 
    : IRequestHandler<GetCurrentUser, CurrentUserDto?>
{
    private readonly IUser _currentUser;
    private readonly IIdentityService _identityService;

    public GetCurrentUserHandler(
        IUser currentUser,
        IIdentityService identityService)
    {
        _currentUser = currentUser;
        _identityService = identityService;
    }

    public async Task<CurrentUserDto?> Handle(
        GetCurrentUser request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(_currentUser.Id))
            return null;

        var user = await _identityService.GetUserByIdAsync(_currentUser.Id);

        if (user == null) return null;

        return new CurrentUserDto
        {
            Id = user.Id,
            Email = user.Email,
            UserName = user.Email,
            FullName = user.FullName,
            AvatarUrl = user.AvatarUrl,
            AvatarPublicId = user.AvatarPublicId,
            Roles = user.Roles
        };
    }
}
