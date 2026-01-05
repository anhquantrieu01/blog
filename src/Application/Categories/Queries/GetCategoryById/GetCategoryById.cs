using MediatR;
using Microsoft.EntityFrameworkCore;
using MyBlog.Application.Common.Interfaces;
using MyBlog.Application.Categories.Dto;

namespace MyBlog.Application.Categories.Queries.GetCategoryById;
public record GetCategoryByIdQuery(int Id) : IRequest<CategoryDto?>;

public class GetCategoryByIdQueryHandler : IRequestHandler<GetCategoryByIdQuery, CategoryDto?>
{
    private readonly IApplicationDbContext _context;

    public GetCategoryByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CategoryDto?> Handle(GetCategoryByIdQuery request, CancellationToken cancellationToken)
    {
        return await _context.Categories
            .Where(c => c.Id == request.Id)
            .Select(c => new CategoryDto {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                Slug = c.Slug
            })
            .FirstOrDefaultAsync(cancellationToken);
    }
}