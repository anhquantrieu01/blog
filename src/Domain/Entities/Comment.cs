using MyBlog.Domain.Common;

namespace MyBlog.Domain.Entities;

public class Comment : BaseEntity
{
    public string Content { get; set; } = default!;

    public int PostId { get; set; }
    public string AuthorId { get; set; } = default!;
    public string? ThumbnailUrl { get; set; }
    public string? ThumbnailPublicId { get; set; }
    public Post Post { get; set; } = default!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
