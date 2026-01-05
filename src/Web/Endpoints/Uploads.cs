using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MyBlog.Application.Common.Interfaces;
using MyBlog.Application.Common.Models;
using MyBlog.Application.Uploads.Commands.CreateUpload;
namespace MyBlog.Web.Endpoints;

public class Uploads : EndpointGroupBase
{
    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapPost(UploadFile)
            .DisableAntiforgery()
            .Accepts<IFormFile>("multipart/form-data")
            .RequireAuthorization();

        groupBuilder.MapDelete(DeleteFile, "{publicId}")
            .RequireAuthorization();

        groupBuilder.MapPut(ReplaceFile, "{oldPublicId}")
            .Accepts<IFormFile>("multipart/form-data")
            .RequireAuthorization();
    }

   
    public async Task<Results<Ok<ImageUploadResultDto>, BadRequest<string>>> UploadFile(
        IImageService imageService,
        ISender sender,
        IFormFile file)
    {
       

        if (file == null || file.Length == 0)
            return TypedResults.BadRequest<string>("File is required");

        try
        {
            using var stream = file.OpenReadStream();
            var uploadResult =  await imageService.UploadAsync(stream, file.FileName);
            await sender.Send(new CreateUploadCommand(
            Url: uploadResult.Url,
            PublicId: uploadResult.PublicId
        ));
            return TypedResults.Ok(uploadResult);
        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest<string>($"File upload failed: {ex.Message}");
        }
    }

   
    public async Task<Results<Ok, BadRequest<string>>> DeleteFile(
        IImageService imageService,
        [FromRoute] string publicId)
    {
        if (string.IsNullOrWhiteSpace(publicId))
            return TypedResults.BadRequest<string>("publicId is required");

        var success = await imageService.DeleteAsync(publicId);
        return success ? TypedResults.Ok() : TypedResults.BadRequest<string>("Failed to delete file");
    }

    
    public async Task<Results<Ok<ImageUploadResultDto>, BadRequest<string>>> ReplaceFile(
        IImageService imageService,
        [FromRoute] string oldPublicId,
        HttpContext httpContext)
    {
        if (string.IsNullOrWhiteSpace(oldPublicId))
            return TypedResults.BadRequest<string>("oldPublicId is required");

        var form = await httpContext.Request.ReadFormAsync();
        var file = form.Files.GetFile("file");

        if (file == null || file.Length == 0)
            return TypedResults.BadRequest<string>("File is required");

        try
        {
            // Chuyển IFormFile thành Stream + fileName để gọi Application Layer
            var result = await imageService.ReplaceAsync(oldPublicId, file.OpenReadStream(), file.FileName);
            return TypedResults.Ok(result);
        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest<string>($"File replace failed: {ex.Message}");
        }
    }
}
