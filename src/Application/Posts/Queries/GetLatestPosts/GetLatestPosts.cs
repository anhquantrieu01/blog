using MediatR;
using Microsoft.EntityFrameworkCore;
using MyBlog.Application.Common.Interfaces;
using MyBlog.Application.Common.Models;
using MyBlog.Application.Posts.Dto;
namespace MyBlog.Application.Posts.Queries.GetLatestPosts;


public record GetLatestPostsQuery(int Take = 3) : IRequest<List<PostDto>>;

public class GetLatestPostsQueryHandler 
    : IRequestHandler<GetLatestPostsQuery, List<PostDto>>
{
    private readonly IApplicationDbContext _context;

    public GetLatestPostsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<PostDto>> Handle(
        GetLatestPostsQuery request,
        CancellationToken cancellationToken)
    {
        return await _context.Posts
            .OrderByDescending(p => p.CreatedAt)
            .Take(request.Take)
            .Select(p => new PostDto
            {
                Id = p.Id,
                Title = p.Title,
                Summary = p.Summary,
                Content = p.Content,
                CategoryId = p.CategoryId,
                ThumbnailUrl = p.ThumbnailUrl,
                ThumbnailPublicId = p.ThumbnailPublicId,
                Slug = p.Slug,
                AuthorId = p.AuthorId,
                CreatedAt = p.CreatedAt
            })
            .ToListAsync(cancellationToken);
    }
}
