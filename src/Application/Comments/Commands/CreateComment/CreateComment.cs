using MediatR;
using MyBlog.Application.Common.Interfaces;
using MyBlog.Domain.Entities;
using MyBlog.Application.Comments.Dto;
namespace MyBlog.Application.Comments.Commands.CreateComment;

public record CreateCommentCommand(int PostId, string Content, string AuthorId, string? ThumbnailUrl, string? ThumbnailPublicId) : IRequest<CommentDto>;

public class CreateCommentCommandHandler : IRequestHandler<CreateCommentCommand, CommentDto>
{
    private readonly IApplicationDbContext _context;

    public CreateCommentCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CommentDto> Handle(CreateCommentCommand request, CancellationToken cancellationToken)
    {
        var comment = new Comment
        {
            PostId = request.PostId,
            Content = request.Content,
            AuthorId = request.AuthorId,
            ThumbnailUrl = request.ThumbnailUrl,
            ThumbnailPublicId = request.ThumbnailPublicId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Comments.Add(comment);
        await _context.SaveChangesAsync(cancellationToken);

        var commentDto = new CommentDto
        {
            Id = comment.Id,

            Content = comment.Content,
            PostId = comment.PostId,
            ThumbnailUrl = comment.ThumbnailUrl,
            ThumbnailPublicId = comment.ThumbnailPublicId,
            AuthorId = comment.AuthorId
        };

        return commentDto;
    }
}
