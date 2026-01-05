namespace MyBlog.Application.Categories.Dto;

public record CategoryDto
{
    public int Id { get; init; }
    public string Name { get; init; } = default!;
    public string Slug { get; init; } = default!;
    public string? Description { get; init; }
}
