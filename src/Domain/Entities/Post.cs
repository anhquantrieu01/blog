using MyBlog.Domain.Common;

namespace MyBlog.Domain.Entities;

public class Post : BaseEntity
{
    public string Title { get; set; } = default!;
    public string Slug { get; set; } = default!;
    public string Content { get; set; } = default!;
    public string? ThumbnailUrl { get; set; }
    public string? ThumbnailPublicId { get; set; }
    public string Summary { get; set; } = default!;

    public bool IsPublished { get; set; } = true;

    // Liên kết với User (ApplicationUser trong Infrastructure)
    public string AuthorId { get; set; } = default!;

    // Liên kết Category
    public int CategoryId { get; set; }

    // Navigation
    public Category Category { get; set; } = default!;
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
