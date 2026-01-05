using Microsoft.AspNetCore.Identity;

namespace MyBlog.Infrastructure.Identity;

public class ApplicationUser : IdentityUser
{
    public string? FullName { get; set; }
    public string? AvatarUrl { get; set; }
    public string? AvatarPublicId { get; set; }
}
