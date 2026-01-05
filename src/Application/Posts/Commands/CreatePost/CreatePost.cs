using MyBlog.Application.Common.Interfaces;
using MyBlog.Domain.Entities;
using MyBlog.Application.Posts.Dto; // cần có PostDto
using MyBlog.Application.Common.Helpers;

namespace MyBlog.Application.Posts.Commands.CreatePost;

public record CreatePostCommand(
    string Title,
    string Summary,
    string Content,
    int CategoryId,
    string ThumbnailUrl,
    string ThumbnailPublicId
) : IRequest<PostDto>;

public class CreatePostCommandHandler : IRequestHandler<CreatePostCommand, PostDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IUser _user;
    private readonly ISlugService _slugService;

    public CreatePostCommandHandler(IApplicationDbContext context, IUser user, ISlugService slugService)
    {
        _context = context;
        _user = user;
        _slugService = slugService;

    }

    public async Task<PostDto> Handle(CreatePostCommand request, CancellationToken cancellationToken)
    {
        var slug = await _slugService.GenerateUniqueSlugAsync(request.Title, "Post");

        var post = new Post
        {
            Title = request.Title,
            Slug = slug,
            Summary = request.Summary,
            Content = request.Content,
            AuthorId = _user.Id!,
            CategoryId = request.CategoryId,
            ThumbnailUrl = request.ThumbnailUrl,
            ThumbnailPublicId = request.ThumbnailPublicId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Posts.Add(post);
        await _context.SaveChangesAsync(cancellationToken);
        var publicIds = HtmlImageParser.ExtractPublicIds(request.Content);
        if (publicIds.Count > 0)
        {
            await _context.ContentAssets
                .Where(x => publicIds.Contains(x.PublicId) && x.PostId == null)
                .ForEachAsync(x =>
                {
                    x.PostId = post.Id;
                    x.IsDeleted = false;
                    x.LastReferencedAt = DateTime.UtcNow;
                }, cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);
        }

        var postDto = new PostDto
        {
            Id = post.Id,
            Title = post.Title,
            Summary = post.Summary,
            Content = post.Content,
            CategoryId = post.CategoryId,
            ThumbnailUrl = post.ThumbnailUrl,
            ThumbnailPublicId = post.ThumbnailPublicId,
            Slug = post.Slug,
            AuthorId = post.AuthorId
        };

        return postDto;
    }
}
