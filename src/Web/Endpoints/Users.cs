using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Text.Json;

using MyBlog.Application.Common.Interfaces;
using MyBlog.Application.Users.Commands.CreateUser;
using MyBlog.Application.Users.Commands.UpdateUser;
using MyBlog.Application.Users.Commands.ChangePassword;
using MyBlog.Application.Users.Commands.DeleteUser;
using MyBlog.Application.Users.Queries.GetAllUsers;
using MyBlog.Application.Users.Queries.GetUserById;
using MyBlog.Application.Common.Models;
using MyBlog.Application.Users.Dto;
namespace MyBlog.Web.Endpoints;

public class Users : EndpointGroupBase
{
    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetAllUsers).RequireAuthorization();
        groupBuilder.MapGet(GetUserById, "{id}").RequireAuthorization();
        groupBuilder.MapPost(CreateUser).RequireAuthorization();
        groupBuilder.MapPut(UpdateUser, "{id}").RequireAuthorization();
        groupBuilder.MapDelete(DeleteUser, "{id}").RequireAuthorization();
        groupBuilder.MapPut(ChangePassword, "{id}/change-password")
            .RequireAuthorization();
    }

    public async Task<Ok<PaginatedList<UserDto>>> GetAllUsers(ISender sender, HttpContext http, int pageNumber = 1,
    int pageSize = 8)
    {
        var data = await sender.Send(new GetAllUsersQuery(pageNumber, pageSize));

        return TypedResults.Ok(data);
    }

    public async Task<Ok<UserDto>> GetUserById(ISender sender, string id)
    {
        var user = await sender.Send(new GetUserByIdQuery(id));
        if (user == null)
            return TypedResults.Ok<UserDto>(null!);
        return TypedResults.Ok(user);
    }

    public async Task<IResult> CreateUser(ISender sender, CreateUserCommand command)
    {


        if (string.IsNullOrWhiteSpace(command.Email))
            return TypedResults.BadRequest("Email is required");
        if (string.IsNullOrWhiteSpace(command.Password))
            return TypedResults.BadRequest("Password is required");


        var createCommand = new CreateUserCommand(
            FullName: command.FullName,
            Email: command.Email,
            Password: command.Password,
            AvatarUrl: command.AvatarUrl,
            AvatarPublicId: command.AvatarPublicId
        );

        var createUser = await sender.Send(createCommand);

        return TypedResults.Ok(new { data = createUser });
    }

    public async Task<IResult> UpdateUser(ISender sender, string id, UpdateUserCommand command)
    {

       var updateCommand = new UpdateUserCommand(
            id,
            command.FullName,
            command.Email,
            command.AvatarUrl,
            command.AvatarPublicId,
            command.Roles
        );

        var updatedUser = await sender.Send(updateCommand);
        return TypedResults.Ok(new { data = updatedUser });
    }

    public async Task<NoContent> DeleteUser(ISender sender, string id)
    {
        await sender.Send(new DeleteUserCommand(id));
        return TypedResults.NoContent();
    }
    public async Task<IResult> ChangePassword(
    ISender sender,
    ChangePasswordCommand command,
    string id)
    {

        var updateCommand = new ChangePasswordCommand(
        id,
        command.CurrentPassword,
        command.NewPassword
    );
        var updatedPassword = await sender.Send(updateCommand);

        return TypedResults.Ok(new { data = updatedPassword });
    }

}
