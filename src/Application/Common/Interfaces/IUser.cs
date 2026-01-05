namespace MyBlog.Application.Common.Interfaces;

public interface IUser
{
   string? Id { get; }
    string? Email { get; }
    string? UserName { get; } 

    string? FullName { get; }
    List<string>? Roles { get; }
    string? AvatarUrl { get; }
    string? AvatarPublicId { get; }

}
