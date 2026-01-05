using MediatR;
using MyBlog.Application.Common.Interfaces;
using MyBlog.Domain.Entities;

namespace MyBlog.Application.Categories.Commands.DeleteCategory;

public record DeleteCategoryCommand(int Id) : IRequest;

public class DeleteCategoryCommandHandler : IRequestHandler<DeleteCategoryCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteCategoryCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _context.Categories.FindAsync(new object[] { request.Id }, cancellationToken);
        if (category == null)
            throw new NotFoundException(nameof(Category), request.Id.ToString());

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
