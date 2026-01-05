using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MyBlog.Application.Common.Interfaces;
using MyBlog.Application.Common.Models;

namespace MyBlog.Web.Endpoints;

public class Images : EndpointGroupBase
{
    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder
            .MapPost(UploadImage)
            .DisableAntiforgery()
            .Accepts<IFormFile>("multipart/form-data")
            .RequireAuthorization();

        groupBuilder
            .MapDelete(DeleteImage, "{publicId}")
            .RequireAuthorization();
    }

  
    public async Task<Results<Ok<ImageUploadResultDto>, BadRequest<string>>> UploadImage(
        IFormFile file,
        IImageService imageService)
    {
        if (file == null || file.Length == 0)
        {
            return TypedResults.BadRequest("File is required");
        }

        try
        {
            using var stream = file.OpenReadStream();
            var uploadResult = await imageService.UploadAsync(
                stream,
                file.FileName
            );

            return TypedResults.Ok(uploadResult);
        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest($"File upload failed: {ex.Message}");
        }
    }

    public async Task<Results<Ok, BadRequest<string>>> DeleteImage(
        IImageService imageService,
        [FromRoute] string publicId)
    {
        if (string.IsNullOrWhiteSpace(publicId))
            return TypedResults.BadRequest("publicId is required");

        var success = await imageService.DeleteAsync(publicId);

        return success
            ? TypedResults.Ok()
            : TypedResults.BadRequest("Failed to delete file");
    }
}
