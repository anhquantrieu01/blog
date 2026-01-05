using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using MyBlog.Application.Common.Models;
using MyBlog.Application.Common.Interfaces;
using MyBlog.Application.Posts.Commands.CreatePost;
using MyBlog.Application.Posts.Commands.DeletePost;
using MyBlog.Application.Posts.Commands.UpdatePost;
using PostByIdDto = MyBlog.Application.Posts.Queries.GetPostById.PostDetailDto;
using PostBySlugDto = MyBlog.Application.Posts.Queries.GetPostBySlug.PostDetailDto;
using MyBlog.Application.Posts.Queries.GetPostById;
using MyBlog.Application.Posts.Queries.GetPostBySlug;
using MyBlog.Application.Posts.Queries.GetPosts;
using MyBlog.Application.Posts.Dto;
using MyBlog.Application.Posts.Queries.GetLatestPosts;
namespace MyBlog.Web.Endpoints;

public class Posts : EndpointGroupBase
{
    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetPosts).AllowAnonymous();
        groupBuilder.MapGet(GetPostById, "{id:int}").AllowAnonymous();
        groupBuilder.MapGet(GetPostBySlug, "{slug}").AllowAnonymous();
        groupBuilder.MapGet("latest", GetLatestPosts).AllowAnonymous();
        groupBuilder.MapPost(CreatePost).RequireAuthorization();
        groupBuilder.MapPut(UpdatePost, "{id}").RequireAuthorization();
        groupBuilder.MapDelete(DeletePost, "{id}").RequireAuthorization();
    }

    public async Task<Ok<PaginatedList<PostDto>>> GetPosts(ISender sender, HttpContext http, int pageNumber = 1,
    int pageSize = 8, string? search = null,
    int? categoryId = null,
    PostSort sort = PostSort.Newest)
    {
        var data = await sender.Send(
        new GetPostsQuery(pageNumber, pageSize, search, categoryId, sort)
    );
        http.Response.Headers.Append(
        "Content-Range",
        $"posts {(pageNumber - 1) * pageSize}-{pageNumber * pageSize}/{data.TotalCount}"
    );

        http.Response.Headers.Append(
            "Access-Control-Expose-Headers",
            "Content-Range"
        );

        return TypedResults.Ok(data);
    }

    public async Task<Ok<List<PostDto>>> GetLatestPosts(
    ISender sender,
    HttpContext http,
    int take = 3
)
    {
        var data = await sender.Send(new GetLatestPostsQuery(take));

        http.Response.Headers.Append(
            "Content-Range",
            $"posts 0-{data.Count}/{data.Count}"
        );
        http.Response.Headers.Append(
            "Access-Control-Expose-Headers",
            "Content-Range"
        );

        return TypedResults.Ok(data);
    }

    public async Task<Ok<PostByIdDto>> GetPostById(ISender sender, int id)
    {
        var data = await sender.Send(new GetPostByIdQuery(id));
        return TypedResults.Ok(data);
    }

    public async Task<Ok<PostBySlugDto>> GetPostBySlug(ISender sender, string slug)
    {
        var data = await sender.Send(new GetPostBySlugQuery(slug));
        return TypedResults.Ok(data);
    }

    public async Task<IResult> CreatePost(
    HttpContext httpContext,
    ISender sender,
    IImageService imageService,
    ISlugService slugService,
    IUser user,
    CreatePostCommand command
)
    {
        if (string.IsNullOrWhiteSpace(command.Title))
            return TypedResults.BadRequest("Title is required");

        if (string.IsNullOrWhiteSpace(command.Summary))
            return TypedResults.BadRequest("Summary is required");

        if (string.IsNullOrWhiteSpace(command.Content))
            return TypedResults.BadRequest("Content is required");

        if (command.CategoryId <= 0)
            return TypedResults.BadRequest("Invalid CategoryId");

        if (string.IsNullOrWhiteSpace(command.ThumbnailUrl))
            return TypedResults.BadRequest("Thumbnail URL is required");

        if (string.IsNullOrWhiteSpace(command.ThumbnailPublicId))
            return TypedResults.BadRequest("ThumbnailPublicId is required");



        var createdPost = await sender.Send(command);
        return TypedResults.Ok(new { data = createdPost });
    }

    public async Task<IResult> UpdatePost(
         int id,
        ISender sender,
        UpdatePostCommand command
    )
    {


        var updateCommand = new UpdatePostCommand(
            Id: id,
            Title: command.Title,
            Summary: command.Summary,
            Content: command.Content,
            CategoryId: command.CategoryId,
            ThumbnailUrl: command.ThumbnailUrl,
            ThumbnailPublicId: command.ThumbnailPublicId
        );

        var updatedPost = await sender.Send(updateCommand);

        return TypedResults.Ok(new { data = updatedPost });
    }

    public async Task<NoContent> DeletePost(ISender sender, int id)
    {
        await sender.Send(new DeletePostCommand(id));
        return TypedResults.NoContent();
    }
}
