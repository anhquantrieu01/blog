using MyBlog.Application.Common.Models;
using MyBlog.Application.Users.Dto;

namespace MyBlog.Application.Common.Interfaces;

public interface IIdentityService
{
    Task<string?> GetUserNameAsync(string userId);

    Task<bool> IsInRoleAsync(string userId, string role);

    Task<bool> AuthorizeAsync(string userId, string policyName);

    Task<(Result Result, string UserId)> CreateUserAsync(string userName, string password);

    Task<Result> DeleteUserAsync(string userId);

    Task<Result> RegisterUserAsync(string? fullName, string email, string password, string? avatarUrl = null, string? avatarPublicId = null);
    Task<Result> PasswordSignInAsync(string email, string password);
    Task<Result> SignOutAsync();
    Task<UserDto?> GetUserByIdAsync(string userId);
    Task<List<UserDto>> GetAllUsersAsync();
    Task<UserDto> UpdateUserAsync(string userId, string fullName, string email, string? avatarUrl = null, string? avatarPublicId = null, List<string>? roles = null);
    Task<Result> ChangePasswordAsync(string userId, string currentPassword, string newPassword);
    IQueryable<UserDto> Users { get; }
    Task<List<string>> GetRolesAsync(string userId);
}
