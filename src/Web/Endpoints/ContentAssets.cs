using MediatR;
using MyBlog.Application.ContentAssets.Commands.UpdateContentAsset;
using Microsoft.AspNetCore.Http.HttpResults;

namespace MyBlog.Web.Endpoints;

public class ContentAssets : EndpointGroupBase
{
    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapPost(UpdateContentAsset)
                    .RequireAuthorization();
    }

    public async Task<NoContent> UpdateContentAsset(
        ISender sender,
        UpdateContentAssetCommand command)
    {
        await sender.Send(command);
        return TypedResults.NoContent();
    }
}
