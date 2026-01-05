using MediatR;
using Microsoft.EntityFrameworkCore;
using MyBlog.Application.Common.Interfaces;
using MyBlog.Application.Posts.Dto;
using MyBlog.Application.Common.Models;
namespace MyBlog.Application.Posts.Queries.GetPosts;

public enum PostSort
{
    Newest = 0,
    Oldest = 1
}
public record GetPostsQuery(
    int PageNumber,
    int PageSize,
    string? Search = null,
    int? CategoryId = null,
    PostSort Sort = PostSort.Newest
) : IRequest<PaginatedList<PostDto>>;

public class GetPostsQueryHandler
    : IRequestHandler<GetPostsQuery, PaginatedList<PostDto>>
{
    private readonly IApplicationDbContext _context;

    public GetPostsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedList<PostDto>> Handle(
        GetPostsQuery request,
        CancellationToken cancellationToken)
    {
        var query = _context.Posts
        .Include(x => x.Category)
        .AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var keyword = request.Search.ToLower();

            query = query.Where(x =>
                x.Title.ToLower().Contains(keyword)
            );
        }

        if (request.CategoryId.HasValue)
        {
            query = query.Where(x =>
                x.CategoryId == request.CategoryId.Value);
        }

        query = request.Sort switch
        {
            PostSort.Oldest => query.OrderBy(x => x.CreatedAt),
            _ => query.OrderByDescending(x => x.CreatedAt)
        };

        var dtoQuery = query.Select(x => new PostDto
        {
            Id = x.Id,
            Title = x.Title,
            Slug = x.Slug,
            Summary = x.Summary,
            ThumbnailUrl = x.ThumbnailUrl,
            CategoryId = x.CategoryId,
            CategoryName = x.Category.Name,
            AuthorId = x.AuthorId,
            CreatedAt = x.CreatedAt
        });

        return await PaginatedList<PostDto>.CreateAsync(
            dtoQuery,
            request.PageNumber,
            request.PageSize,
            cancellationToken
        );
    }
}
