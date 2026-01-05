namespace MyBlog.Application.Comments.Dto
{
    public class CommentDto
    {
        public int Id { get; set; }

        public string Content { get; set; } = null!;
        public int PostId { get; set; }
        public string? ThumbnailUrl { get; set; }

        public string? ThumbnailPublicId { get; set; }

        public string AuthorId { get; set; } = null!;
        public string AuthorName { get; set; } = null!;
        public string? AuthorAvatarUrl { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

    }
}
