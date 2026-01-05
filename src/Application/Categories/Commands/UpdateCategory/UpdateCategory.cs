using MediatR;
using Microsoft.EntityFrameworkCore;
using MyBlog.Application.Common.Interfaces;
using MyBlog.Application.Categories.Dto;
using MyBlog.Domain.Entities;

namespace MyBlog.Application.Categories.Commands.UpdateCategory;

public record UpdateCategoryCommand(
    int Id,
    string Name,
    string? Description
) : IRequest<CategoryDto>;

public class UpdateCategoryCommandHandler : IRequestHandler<UpdateCategoryCommand, CategoryDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ISlugService _slugService;

    public UpdateCategoryCommandHandler(IApplicationDbContext context, ISlugService slugService)
    {
        _context = context;
        _slugService = slugService;
    }

    public async Task<CategoryDto> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

        if (category == null)
            throw new NotFoundException(nameof(Category), request.Id.ToString());

        if (!string.Equals(category.Name, request.Name, StringComparison.OrdinalIgnoreCase))
        {
            var newSlug = await _slugService.GenerateUniqueSlugAsync(request.Name, "Category");
            category.Name = request.Name;
            category.Slug = newSlug;
        }

        category.Description = request.Description;

        await _context.SaveChangesAsync(cancellationToken);

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Slug = category.Slug,
            Description = category.Description
        };
    }
}
