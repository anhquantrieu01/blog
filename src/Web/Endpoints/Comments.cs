using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;

using MyBlog.Application.Common.Interfaces;
using MyBlog.Application.Common.Models;
using MyBlog.Application.Comments.Commands.CreateComment;
using MyBlog.Application.Comments.Commands.UpdateComment;
using MyBlog.Application.Comments.Commands.DeleteComment;
using MyBlog.Application.Comments.Queries.GetCommentsByPostId;
using MyBlog.Application.Comments.Dto;
namespace MyBlog.Web.Endpoints;

public class Comments : EndpointGroupBase
{
    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetCommentsByPostId, "post/{postId}/comments").AllowAnonymous();
        groupBuilder.MapPost(CreateComment).RequireAuthorization();
        groupBuilder.MapPut(UpdateComment, "{id}").RequireAuthorization();
        groupBuilder.MapDelete(DeleteComment, "{id}").RequireAuthorization();
    }

    public async Task<Ok<PaginatedList<CommentDto>>> GetCommentsByPostId(ISender sender, int postId, HttpContext httpContext, int pageNumber = 1,
        int pageSize = 5)
    {
        var data = await sender.Send(new GetCommentsByPostIdQuery(postId, pageNumber, pageSize));
        var total = data.TotalCount;

        httpContext.Response.Headers.Append("Content-Range", $"posts 0-{total}/{total}");
        httpContext.Response.Headers.Append("Access-Control-Expose-Headers", "Content-Range");
        return TypedResults.Ok(data);
    }

    public async Task<IResult> CreateComment(
    CreateCommentCommand command,
    ISender sender,
    IUser user)
    {

        if (string.IsNullOrWhiteSpace(command.Content))
            return TypedResults.BadRequest("Content is required");

        if (command.PostId <= 0)
            return TypedResults.BadRequest("Invalid PostId");

        var createComment = new CreateCommentCommand(
            PostId: command.PostId,
            Content: command.Content,
            AuthorId: user.Id!,
            ThumbnailUrl: command.ThumbnailUrl,
            ThumbnailPublicId: command.ThumbnailPublicId
        );
        var createdComment = await sender.Send(createComment);

        return TypedResults.Ok(new { data = createdComment });
    }

    public async Task<IResult> UpdateComment(ISender sender, int id, UpdateCommentCommand command)
    {

        var updateCommand = new UpdateCommentCommand(
            Id: id,
            Content: command.Content,
            ThumbnailUrl: command.ThumbnailUrl,
            ThumbnailPublicId: command.ThumbnailPublicId,
            RemoveThumbnail: command.RemoveThumbnail
   );

        var updatedComment = await sender.Send(updateCommand);
        return TypedResults.Ok(new { data = updatedComment });
    }

    public async Task<NoContent> DeleteComment(ISender sender, int id)
    {
        await sender.Send(new DeleteCommentCommand(id));
        return TypedResults.NoContent();
    }
}
