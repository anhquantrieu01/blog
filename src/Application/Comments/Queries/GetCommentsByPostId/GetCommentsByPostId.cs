using MediatR;
using Microsoft.EntityFrameworkCore;
using MyBlog.Application.Common.Interfaces;
using MyBlog.Application.Common.Models;
using MyBlog.Application.Comments.Dto;

namespace MyBlog.Application.Comments.Queries.GetCommentsByPostId;

public record GetCommentsByPostIdQuery(
    int PostId,
    int PageNumber = 1,
    int PageSize = 5
) : IRequest<PaginatedList<CommentDto>>;

public class GetCommentsByPostIdQueryHandler : IRequestHandler<GetCommentsByPostIdQuery, PaginatedList<CommentDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IIdentityService _identityService;

    public GetCommentsByPostIdQueryHandler(
        IApplicationDbContext context,
        IIdentityService identityService)
    {
        _context = context;
        _identityService = identityService;
    }

    public async Task<PaginatedList<CommentDto>> Handle(GetCommentsByPostIdQuery request, CancellationToken cancellationToken)
    {
        var comments = await _context.Comments
            .AsNoTracking()
            .Where(c => c.PostId == request.PostId)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync(cancellationToken);

        var authorIds = comments.Select(c => c.AuthorId).Distinct().ToList();

        var users = await Task.WhenAll(authorIds.Select(id => _identityService.GetUserByIdAsync(id)));
        var userDict = users
            .Where(u => u != null)
            .ToDictionary(u => u!.Id, u => u);

        var commentDtos = comments.Select(c =>
        {
            userDict.TryGetValue(c.AuthorId, out var author);

            return new CommentDto
            {
                Id = c.Id,
                Content = c.Content,
                PostId = c.PostId,
                ThumbnailUrl = c.ThumbnailUrl,
                ThumbnailPublicId = c.ThumbnailPublicId,
                AuthorId = c.AuthorId,
                AuthorName = author?.FullName ?? author?.Email ?? "Unknown",
                AuthorAvatarUrl = author?.AvatarUrl ?? "",
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt
            };
        }).ToList();

        var pagedList = commentDtos
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToList();

        return new PaginatedList<CommentDto>(
            pagedList,
            commentDtos.Count,
            request.PageNumber,
            request.PageSize
        );
    }
}
