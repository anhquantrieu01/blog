using MediatR;
using Microsoft.EntityFrameworkCore;
using MyBlog.Application.Common.Exceptions;
using MyBlog.Application.Common.Interfaces;
using MyBlog.Domain.Entities;

namespace MyBlog.Application.Posts.Queries.GetPostById;

public record PostDetailDto(
    int Id,
    string Title,
    string Slug,
    string Summary,
    string Content,
    string? ThumbnailUrl,
    string? ThumbnailPublicId,
    string CategoryName,
    int CategoryId,
    string AuthorId,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);

public record GetPostByIdQuery(int Id) : IRequest<PostDetailDto>;

public class GetPostByIdQueryHandler : IRequestHandler<GetPostByIdQuery, PostDetailDto>
{
    private readonly IApplicationDbContext _context;

    public GetPostByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PostDetailDto> Handle(GetPostByIdQuery request, CancellationToken cancellationToken)
    {
        // Load cả Category bằng Include
        var post = await _context.Posts
            .Include(x => x.Category)
            .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (post == null)
            throw new NotFoundException(nameof(Post), request.Id.ToString());

        return new PostDetailDto(
            post.Id,
            post.Title,
            post.Slug,
            post.Summary,
            post.Content,
            post.ThumbnailUrl,
            post.ThumbnailPublicId,
            post.Category.Name,
            post.Category.Id,
            post.AuthorId,
            post.CreatedAt,
            post.UpdatedAt
        );
    }
}
