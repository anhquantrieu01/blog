using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace MyBlog.Infrastructure.Identity;

public static class IdentitySeed
{
    public static async Task SeedRolesAsync(IServiceProvider serviceProvider)
    {
        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

        string[] roleNames = { "USER", "ADMIN", "MANAGER" };

        foreach (var roleName in roleNames)
        {
            var roleExist = await roleManager.RoleExistsAsync(roleName);
            if (!roleExist)
            {
                await roleManager.CreateAsync(new IdentityRole(roleName));
            }
        }

        // 🧑‍💻 Tạo tài khoản SuperAdmin mặc định (nếu chưa có)
        var superAdminEmail = "admin@blog.com";
        var superAdminUser = await userManager.FindByEmailAsync(superAdminEmail);

        if (superAdminUser == null)
        {
            var newSuperAdmin = new ApplicationUser
            {
                UserName = "admin",
                Email = superAdminEmail,
                EmailConfirmed = true,
                FullName = "Super Administrator"
            };

            var result = await userManager.CreateAsync(newSuperAdmin, "Admin@123");

            if (result.Succeeded)
            {
                await userManager.AddToRolesAsync(newSuperAdmin, new[] { "USER", "ADMIN", "MANAGER" });
            }
        }
    }
}
