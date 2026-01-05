namespace MyBlog.Application.Users.Dto;

public record UserDto
{
    public string Id { get; init; } = default!;
    public string? FullName { get; init; } = default!;
    public string Password { get; init; } = default!;
    public string Email { get; init; } = default!;
    public string? AvatarUrl { get; init; }

    public string? AvatarPublicId { get; set; }
    public List<string> Roles { get; set; } = new();
}
