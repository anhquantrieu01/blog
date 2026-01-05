using MyBlog.Domain.Common;

namespace MyBlog.Domain.Entities;

public class ContentAsset : BaseEntity
{
    public string Url { get; set; } = default!;
    public string PublicId { get; set; } = default!;

    public bool IsDeleted { get; set; } = true;

    public int? PostId { get; set; }
    public Post? Post { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime LastReferencedAt { get; set; } = DateTime.UtcNow;
}
