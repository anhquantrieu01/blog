using MediatR;
using MyBlog.Application.Common.Interfaces;
using MyBlog.Domain.Entities;

namespace MyBlog.Application.Comments.Commands.UpdateComment;

public record UpdateCommentCommand( int Id, string? Content, string? ThumbnailUrl, string? ThumbnailPublicId, bool RemoveThumbnail) : IRequest<Comment>;

public class UpdateCommentCommandHandler : IRequestHandler<UpdateCommentCommand, Comment>
{
    private readonly IApplicationDbContext _context;
    private readonly IImageService _imageService;

    public UpdateCommentCommandHandler(IApplicationDbContext context, IImageService imageService)
    {
        _context = context;
        _imageService = imageService;
    }

    public async Task<Comment> Handle(UpdateCommentCommand request, CancellationToken cancellationToken)
    {
        var comment = await _context.Comments.FindAsync(request.Id, cancellationToken);
        if (comment == null)
            throw new NotFoundException(nameof(Comment), request.Id.ToString());

        if (request.Content is not null)
            comment.Content = request.Content;

        if (request.RemoveThumbnail)
        {
            if (!string.IsNullOrEmpty(comment.ThumbnailPublicId))
            {
                await _imageService.DeleteAsync(comment.ThumbnailPublicId);
            }

            comment.ThumbnailUrl = null;
            comment.ThumbnailPublicId = null;
            comment.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);
            return comment;
        }

        if (!string.IsNullOrEmpty(request.ThumbnailPublicId) &&
            request.ThumbnailPublicId != comment.ThumbnailPublicId)
        {
            if (!string.IsNullOrEmpty(comment.ThumbnailPublicId))
            {
                await _imageService.DeleteAsync(comment.ThumbnailPublicId);
            }

            comment.ThumbnailUrl = request.ThumbnailUrl;
            comment.ThumbnailPublicId = request.ThumbnailPublicId;
        }

        comment.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        return comment;
    }


}
