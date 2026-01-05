using MyBlog.Infrastructure.Data;
using MyBlog.Application.Common.Interfaces;
using MyBlog.Web.Services; 
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.AddKeyVaultIfConfigured();
builder.AddApplicationServices();
builder.AddInfrastructureServices();
builder.AddWebServices();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IUser, CurrentUser>();

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireRequireManager", policy => 
        policy.RequireRole("MANAGER"));

    options.AddPolicy("RequireAdminOrAbove", policy => 
        policy.RequireRole("ADMIN", "MANAGER"));

    options.AddPolicy("RequireUserOrAbove", policy => 
        policy.RequireRole("USER", "ADMIN", "MANAGER"));
});

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        return Task.CompletedTask;
    };

    options.Events.OnRedirectToAccessDenied = context =>
    {
        context.Response.StatusCode = StatusCodes.Status403Forbidden;
        return Task.CompletedTask;
    };
});

var app = builder.Build();

if (app.Environment.IsDevelopment() || !app.Environment.IsEnvironment("NSwag"))
{
    await app.InitialiseDatabaseAsync();
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        await MyBlog.Infrastructure.Identity.IdentitySeed.SeedRolesAsync(services);
    }
}
else
{
    app.UseHsts();
}

app.UseHealthChecks("/health");
app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.UseSwaggerUi(settings =>
{
    settings.Path = "/api";
    settings.DocumentPath = "/api/specification.json";
});

app.MapRazorPages();

app.MapFallbackToFile("index.html");

app.UseExceptionHandler(options => { });


app.MapEndpoints();

app.Run();

public partial class Program { }
