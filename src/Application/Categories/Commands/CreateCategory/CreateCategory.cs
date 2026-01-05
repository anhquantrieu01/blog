using MediatR;
using MyBlog.Application.Common.Interfaces;
using MyBlog.Domain.Entities;
using MyBlog.Application.Categories.Dto;
namespace MyBlog.Application.Categories.Commands.CreateCategory;

public record CreateCategoryCommand(
    string Name,
    string? Description
) : IRequest<CategoryDto>;

public class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, CategoryDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ISlugService _slugService;

    public CreateCategoryCommandHandler(IApplicationDbContext context, ISlugService slugService)
    {
        _context = context;
        _slugService = slugService;
    }

    public async Task<CategoryDto> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        var slug = await _slugService.GenerateUniqueSlugAsync(request.Name, "Category");
        var category = new Category
        {
            Name = request.Name,
            Slug = slug,
            Description = request.Description
        };

        _context.Categories.Add(category);
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
