using MediatR;
using MyBlog.Application.Categories.Commands.CreateCategory;
using MyBlog.Application.Categories.Commands.UpdateCategory;
using MyBlog.Application.Categories.Commands.DeleteCategory;
using MyBlog.Application.Categories.Queries.GetCategories;
using MyBlog.Application.Categories.Queries.GetCategoryById;
using MyBlog.Application.Categories.Dto;
using Microsoft.AspNetCore.Http.HttpResults;

namespace MyBlog.Web.Endpoints;

public class Categories : EndpointGroupBase
{
    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetCategories).RequireAuthorization();
        groupBuilder.MapGet("{id:int}", GetCategoryById).RequireAuthorization();
        groupBuilder.MapPost(CreateCategory).RequireAuthorization();
        groupBuilder.MapPut(UpdateCategory, "{id}").RequireAuthorization();
        groupBuilder.MapDelete(DeleteCategory, "{id}").RequireAuthorization();
    }

    public async Task<Ok<List<CategoryDto>>> GetCategories(ISender sender, HttpContext http)
    {
        var data = await sender.Send(new GetCategoriesQuery());
        var total = data.Count;
        http.Response.Headers.Append("Content-Range", $"categories 0-{total}/{total}");
        http.Response.Headers.Append("Access-Control-Expose-Headers", "Content-Range");

        return TypedResults.Ok(data);
    }

    public async Task<Results<Ok<CategoryDto>, NotFound>> GetCategoryById(ISender sender, int id)
{
    var category = await sender.Send(new GetCategoryByIdQuery(id));
    if (category == null)
        return TypedResults.NotFound();

    return TypedResults.Ok(category);
}

    public async Task<IResult> CreateCategory(ISender sender, CreateCategoryCommand command)
    {
        var categoryDto = await sender.Send(command);
        return Results.Created($"/categories/{categoryDto.Id}", new { data = categoryDto });
    }

    public async Task<Results<NoContent, BadRequest>> UpdateCategory(ISender sender, int id, UpdateCategoryCommand command)
    {
        if (id != command.Id)
            return TypedResults.BadRequest();

        await sender.Send(command);
        return TypedResults.NoContent();
    }

    public async Task<NoContent> DeleteCategory(ISender sender, int id)
    {
        await sender.Send(new DeleteCategoryCommand(id));
        return TypedResults.NoContent();
    }
}
