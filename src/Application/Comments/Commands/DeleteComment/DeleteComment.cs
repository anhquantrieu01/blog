using MediatR;
using MyBlog.Application.Common.Interfaces;
using MyBlog.Domain.Entities;

namespace MyBlog.Application.Comments.Commands.DeleteComment;

public record DeleteCommentCommand(int Id) : IRequest;

public class DeleteCommentCommandHandler : IRequestHandler<DeleteCommentCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteCommentCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteCommentCommand request, CancellationToken cancellationToken)
    {
        var comment = await _context.Comments.FindAsync(request.Id, cancellationToken);
        if (comment == null) throw new NotFoundException(nameof(Comment), request.Id.ToString());

        _context.Comments.Remove(comment);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
