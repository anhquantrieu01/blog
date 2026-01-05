using MediatR;
using Microsoft.EntityFrameworkCore;
using MyBlog.Application.Common.Interfaces;

namespace MyBlog.Application.ContentAssets.Commands.UpdateContentAsset;

public record UpdateContentAssetCommand(
    List<string> PublicIds,
    int PostId
) : IRequest<int>;

public class UpdateContentAssetCommandHandler
    : IRequestHandler<UpdateContentAssetCommand, int>
{
    private readonly IApplicationDbContext _context;

    public UpdateContentAssetCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(UpdateContentAssetCommand request, CancellationToken cancellationToken)
    {

        var unlinkedAssets = await _context.ContentAssets
            .Where(x =>
                x.PostId == null &&
                request.PublicIds.Contains(x.PublicId)
            )
            .ToListAsync(cancellationToken);

        foreach (var asset in unlinkedAssets)
        {
            asset.PostId = request.PostId;
        }
        var postAssets = await _context.ContentAssets
          .Where(x => x.PostId == request.PostId)
          .ToListAsync(cancellationToken);

        foreach (var asset in postAssets)
        {
            var isReferenced = request.PublicIds.Contains(asset.PublicId);
            asset.IsDeleted = !isReferenced;
            if (isReferenced)
            {
                asset.LastReferencedAt = DateTime.UtcNow;
            }
        }

        return await _context.SaveChangesAsync(cancellationToken);
    }
}
