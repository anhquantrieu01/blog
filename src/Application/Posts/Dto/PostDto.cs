namespace MyBlog.Application.Posts.Dto
{
    public class PostDto
    {
        public int Id { get; set; }            
        public string Title { get; set; } = null!; 
        public string Summary { get; set; } = null!; 
        public string Content { get; set; } = null!; 
        public int CategoryId { get; set; }    
         public string? CategoryName { get; set; }
        public string? ThumbnailUrl { get; set; } 
        public string? ThumbnailPublicId { get; set; }
        public string Slug { get; set; } = null!; 
        public string AuthorId { get; set; } = null!; 
        public DateTime? CreatedAt { get; set; } 
        public DateTime? UpdatedAt { get; set; } 
    }
}
