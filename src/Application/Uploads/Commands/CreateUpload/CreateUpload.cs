using MyBlog.Application.Common.Interfaces;
using MyBlog.Domain.Entities;
using MyBlog.Application.Common.Models;

namespace MyBlog.Application.Uploads.Commands.CreateUpload;

public record CreateUploadCommand(
    
    string Url,
    string PublicId
) : IRequest<int>; 

public class CreateUploadCommandHandler : IRequestHandler<CreateUploadCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateUploadCommandHandler(IApplicationDbContext context )
    {
        _context = context;
    }

    public async Task<int> Handle(CreateUploadCommand request, CancellationToken cancellationToken)
    {
        

        var asset  = new ContentAsset
        {
            Url = request.Url,
            PublicId = request.PublicId,
            CreatedAt = DateTime.UtcNow
        };

        _context.ContentAssets.Add(asset);
        await _context.SaveChangesAsync(cancellationToken);

        return asset.Id;
    }
}
