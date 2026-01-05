using MediatR;
using Microsoft.EntityFrameworkCore;
using MyBlog.Application.Common.Exceptions;
using MyBlog.Application.Common.Interfaces;
using MyBlog.Domain.Entities;

namespace MyBlog.Application.Posts.Queries.GetPostBySlug;

public record PostDetailDto(
    int Id,
    string Title,
    string Slug,
    string Summary,
    string Content,
    string? ThumbnailUrl,
    string CategoryName,
    string AuthorId,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);

public record GetPostBySlugQuery(string Slug) : IRequest<PostDetailDto>;

public class GetPostBySlugQueryHandler : IRequestHandler<GetPostBySlugQuery, PostDetailDto>
{
    private readonly IApplicationDbContext _context;

    public GetPostBySlugQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PostDetailDto> Handle(GetPostBySlugQuery request, CancellationToken cancellationToken)
    {
        // Load cả Category bằng Include và tìm theo Slug
        var post = await _context.Posts
            .Include(x => x.Category)
            .FirstOrDefaultAsync(x => x.Slug == request.Slug, cancellationToken);

        if (post == null)
            throw new NotFoundException(nameof(Post), request.Slug);

        return new PostDetailDto(
            post.Id,
            post.Title,
            post.Slug,
            post.Summary,
            post.Content,
            post.ThumbnailUrl,
            post.Category.Name,
            post.AuthorId,
            post.CreatedAt,
            post.UpdatedAt
        );
    }
}
