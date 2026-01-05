using MyBlog.Domain.Entities;
using MyBlog.Application.Common.Interfaces;
using MediatR;
using MyBlog.Application.Common.Helpers;
namespace MyBlog.Application.Posts.Commands.UpdatePost;

public record UpdatePostCommand(
    int Id,
    string? Title = null,
    string? Slug = null,
    string? Summary = null,
    string? Content = null,
    int? CategoryId = null,
    string? ThumbnailUrl = null,
    string? ThumbnailPublicId = null
) : IRequest<Post>;

public class UpdatePostCommandHandler : IRequestHandler<UpdatePostCommand, Post>
{
    private readonly IApplicationDbContext _context;
    private readonly ISlugService _slugService;

    public UpdatePostCommandHandler(IApplicationDbContext context, ISlugService slugService)
    {
        _context = context;
        _slugService = slugService;
    }

    public async Task<Post> Handle(UpdatePostCommand request, CancellationToken cancellationToken)
    {
        var post = await _context.Posts.FindAsync(new object[] { request.Id }, cancellationToken);
        if (post == null)
            throw new NotFoundException(nameof(Post), request.Id.ToString());

        // Chỉ update những trường có giá trị mới
        if (request.Title is not null)
        {
            post.Title = request.Title;
            // Nếu Slug không có thì tạo tự động từ Title
            post.Slug = request.Slug ?? await _slugService.GenerateUniqueSlugAsync(request.Title, "Post");
        }
        if (request.Slug is not null) post.Slug = request.Slug;
        if (request.Summary is not null) post.Summary = request.Summary;
        if (request.Content is not null)
        {
            post.Content = request.Content;

            var publicIds = HtmlImageParser.ExtractPublicIds(request.Content);

            var postAssets = await _context.ContentAssets
                .Where(x => x.PostId == post.Id)
                .ToListAsync(cancellationToken);

            foreach (var asset in postAssets)
            {
                var stillUsed = publicIds.Contains(asset.PublicId);

                asset.IsDeleted = !stillUsed;

                if (stillUsed)
                {
                    asset.LastReferencedAt = DateTime.UtcNow;
                }
            }

            var newAssets = await _context.ContentAssets
                .Where(x =>
                    x.PostId == null &&
                    publicIds.Contains(x.PublicId)
                )
                .ToListAsync(cancellationToken);

            foreach (var asset in newAssets)
            {
                asset.PostId = post.Id;
                asset.IsDeleted = false;
                asset.LastReferencedAt = DateTime.UtcNow;
            }
        }
        ;
        if (request.CategoryId is not null) post.CategoryId = request.CategoryId.Value;
        if (request.ThumbnailUrl is not null) post.ThumbnailUrl = request.ThumbnailUrl;
        if (request.ThumbnailPublicId is not null) post.ThumbnailPublicId = request.ThumbnailPublicId;

        post.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return post;
    }
}
