using System.Security.Claims;
using MyBlog.Application.Common.Interfaces;

namespace MyBlog.Web.Services;

public class CurrentUser : IUser
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUser(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    private ClaimsPrincipal? User => _httpContextAccessor.HttpContext?.User;

    public string? Id =>
        User?.FindFirstValue(ClaimTypes.NameIdentifier);

    public string? UserName =>
        User?.Identity?.Name;

    public string? Email =>
        User?.FindFirstValue(ClaimTypes.Email);

    public List<string>? Roles =>
        User?.FindAll(ClaimTypes.Role)
            .Select(x => x.Value)
            .ToList() ?? new List<string>();
    public string? AvatarUrl =>
        User?.FindFirstValue("AvatarUrl");

    public string? FullName =>
        User?.FindFirstValue("FullName");
    public string? AvatarPublicId =>
        User?.FindFirstValue("AvatarPublicId");
}
