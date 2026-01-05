using MyBlog.Application.Common.Interfaces;
using MyBlog.Domain.Entities;
using MyBlog.Application.Common.Helpers;
namespace MyBlog.Application.Posts.Commands.DeletePost;

public record DeletePostCommand(int Id) : IRequest;
public class DeletePostCommandHandler : IRequestHandler<DeletePostCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IImageService _imageService;

    public DeletePostCommandHandler(IApplicationDbContext context, IImageService imageService)
    {
        _context = context;
        _imageService = imageService;
    }

    public async Task Handle(DeletePostCommand request, CancellationToken cancellationToken)
    {
        var post = await _context.Posts
        .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

        if (post == null)
            throw new NotFoundException(nameof(Post), request.Id.ToString());

        // 1. Xóa thumbnail
        if (!string.IsNullOrEmpty(post.ThumbnailPublicId))
        {
            await _imageService.DeleteAsync(post.ThumbnailPublicId);
        }

        // 2. Lấy publicIds trong content
        var publicIds = HtmlImageParser.ExtractPublicIds(post.Content);

        // 3. Mark ContentAssets.IsDeleted = true
        if (publicIds.Count > 0)
        {
            var assets = await _context.ContentAssets
                .Where(x => publicIds.Contains(x.PublicId))
                .ToListAsync(cancellationToken);

            foreach (var asset in assets)
            {
                asset.IsDeleted = true;
                asset.LastReferencedAt = DateTime.UtcNow;
            }
        }

        // 4. Xóa post
        _context.Posts.Remove(post);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
