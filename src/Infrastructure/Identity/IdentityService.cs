using MyBlog.Application.Common.Interfaces;
using MyBlog.Application.Common.Models;
using MyBlog.Application.Users.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace MyBlog.Infrastructure.Identity;

public class IdentityService : IIdentityService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IUserClaimsPrincipalFactory<ApplicationUser> _userClaimsPrincipalFactory;
    private readonly IAuthorizationService _authorizationService;
    private readonly IImageService _imageService;
    public IdentityService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IUserClaimsPrincipalFactory<ApplicationUser> userClaimsPrincipalFactory,
        IAuthorizationService authorizationService, IImageService imageService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _userClaimsPrincipalFactory = userClaimsPrincipalFactory;
        _authorizationService = authorizationService;
        _imageService = imageService;
    }
    public IQueryable<UserDto> Users =>
    _userManager.Users
        .AsNoTracking()
        .Select(u => new UserDto
        {
            Id = u.Id,
            FullName = u.FullName!,
            Email = u.Email!,
            AvatarUrl = u.AvatarUrl,
            AvatarPublicId = u.AvatarPublicId,
        });


    public async Task<List<string>> GetRolesAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return new();

        var roles = await _userManager.GetRolesAsync(user);
        return roles.ToList();
    }
    public async Task<string?> GetUserNameAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        return user?.UserName;
    }

    public async Task<(Result Result, string UserId)> CreateUserAsync(string userName, string password)
    {
        var user = new ApplicationUser
        {
            UserName = userName,
            Email = userName,
        };

        var result = await _userManager.CreateAsync(user, password);
        return (result.ToApplicationResult(), user.Id);
    }

    public async Task<bool> IsInRoleAsync(string userId, string role)
    {
        var user = await _userManager.FindByIdAsync(userId);
        return user != null && await _userManager.IsInRoleAsync(user, role);
    }

    public async Task<bool> AuthorizeAsync(string userId, string policyName)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return false;

        var principal = await _userClaimsPrincipalFactory.CreateAsync(user);
        var result = await _authorizationService.AuthorizeAsync(principal, policyName);
        return result.Succeeded;
    }

    public async Task<Result> DeleteUserAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        return user != null ? await DeleteUserAsync(user) : Result.Success();
    }

    public async Task<Result> DeleteUserAsync(ApplicationUser user)
    {
        var result = await _userManager.DeleteAsync(user);
        return result.ToApplicationResult();
    }


    public async Task<Result> RegisterUserAsync(string? fullName, string email, string password, string? avatarUrl = null, string? avatarPublicId = null)
    {
        var user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            FullName = fullName,
            AvatarUrl = avatarUrl,
            AvatarPublicId = avatarPublicId
        };

        var result = await _userManager.CreateAsync(user, password);

        if (!result.Succeeded)
            return Result.Failure(result.Errors.Select(e => e.Description));

        await _userManager.AddToRoleAsync(user, "USER");
        return Result.Success();
    }

    public async Task<Result> PasswordSignInAsync(string email, string password)
    {
        var result = await _signInManager.PasswordSignInAsync(email, password, false, false);
        return result.Succeeded
            ? Result.Success()
            : Result.Failure(new[] { "Sai email hoặc mật khẩu." });
    }

    public async Task<Result> SignOutAsync()
    {
        try
        {
            await _signInManager.SignOutAsync();
            return Result.Success();
        }
        catch (Exception ex)
        {
            return Result.Failure(new[] { ex.Message });
        }
    }

    public async Task<UserDto> UpdateUserAsync(
     string userId,
     string fullName,
     string email,
     string? avatarUrl = null,
     string? avatarPublicId = null,
     List<string>? roles = null)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            throw new Exception("User not found");

        user.FullName = fullName;
        user.Email = email;
        user.UserName = email;

        if (!string.IsNullOrWhiteSpace(avatarUrl))
            user.AvatarUrl = avatarUrl;

        if (!string.IsNullOrWhiteSpace(avatarPublicId) &&
        avatarPublicId != user.AvatarPublicId)
        {
            if (!string.IsNullOrWhiteSpace(user.AvatarPublicId))
            {
                await _imageService.DeleteAsync(user.AvatarPublicId);
            }

            user.AvatarUrl = avatarUrl;
            user.AvatarPublicId = avatarPublicId;
        }
        var updateResult = await _userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
            throw new Exception(string.Join(", ", updateResult.Errors.Select(e => e.Description)));

        if (roles != null)
        {
            var currentRoles = await _userManager.GetRolesAsync(user);

            var rolesToRemove = currentRoles.Except(roles).Where(r => r != "USER").ToList();
            if (rolesToRemove.Any())
                await _userManager.RemoveFromRolesAsync(user, rolesToRemove);

            var rolesToAdd = roles.Except(currentRoles).ToList();
            if (rolesToAdd.Any())
                await _userManager.AddToRolesAsync(user, rolesToAdd);
        }

        var updatedRoles = await _userManager.GetRolesAsync(user);
        return new UserDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            AvatarUrl = user.AvatarUrl,
            AvatarPublicId = user.AvatarPublicId,
            Roles = updatedRoles.ToList()
        };
    }

    public async Task<Result> ChangePasswordAsync(
    string userId,
    string currentPassword,
    string newPassword)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return Result.Failure(new[] { "User không tồn tại." });

        var result = await _userManager.ChangePasswordAsync(
            user,
            currentPassword,
            newPassword
        );

        if (!result.Succeeded)
        {
            return Result.Failure(
                result.Errors.Select(e => e.Description)
            );
        }

        await _signInManager.RefreshSignInAsync(user);

        return Result.Success();
    }

    public async Task<UserDto?> GetUserByIdAsync(string userId)
    {
        var user = await _userManager.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) return null;

        var roles = await _userManager.GetRolesAsync(user);

        return new UserDto
        {
            Id = user.Id,
            FullName = user.FullName!,
            Email = user.Email!,
            AvatarUrl = user.AvatarUrl,
            AvatarPublicId = user.AvatarPublicId,
            Roles = roles.ToList()
        };
    }
    public async Task<List<UserDto>> GetAllUsersAsync()
    {
        var users = await _userManager.Users.ToListAsync();
        var list = new List<UserDto>();
        foreach (var u in users)
        {
            var roles = await _userManager.GetRolesAsync(u);
            list.Add(new UserDto
            {
                Id = u.Id,
                FullName = u.FullName!,
                Email = u.Email!,
                AvatarUrl = u.AvatarUrl,
                AvatarPublicId = u.AvatarPublicId,
                Roles = roles.ToList()
            });
        }
        return list;
    }
}
