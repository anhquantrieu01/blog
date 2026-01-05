using MyBlog.Application.Auth.Commands.Login;
using MyBlog.Application.Auth.Commands.Register;
using MyBlog.Application.Auth.Commands.Logout;
using MyBlog.Application.Auth.Queries.GetCurrentUser;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;

namespace MyBlog.Web;

public class Auth : EndpointGroupBase
{
    public override void Map(RouteGroupBuilder group)
    {
        group.MapPost("/register", Register);
        group.MapPost("/login", Login);
        group.MapPost("/logout", Logout).RequireAuthorization();
        group.MapGet("/me", Me).RequireAuthorization();
    }

    public async Task<Results<Ok<string>, BadRequest<string[]>>> Register(
        ISender sender, RegisterCommand command)
    {
        var result = await sender.Send(command);

        return result.Succeeded
            ? TypedResults.Ok("Registration successful")
            : TypedResults.BadRequest(result.Errors);
    }

    public async Task<Results<Ok<string>, BadRequest<string[]>>> Login(
        ISender sender, LoginCommand command)
    {
        var result = await sender.Send(command);

        return result.Succeeded
            ? TypedResults.Ok("Login successful")
            : TypedResults.BadRequest(result.Errors);
    }

   public async Task<Results<Ok<string>, BadRequest<string[]>>> Logout(ISender sender)
{
    var result = await sender.Send(new LogoutCommand());

    return result.Succeeded
        ? TypedResults.Ok("Logged out successfully")
        : TypedResults.BadRequest(result.Errors);
}

    [Authorize]
    public async Task<Ok<CurrentUserDto>> Me(ISender sender)
    {
        var result = await sender.Send(new GetCurrentUser());
        return TypedResults.Ok(result);
    }
}
