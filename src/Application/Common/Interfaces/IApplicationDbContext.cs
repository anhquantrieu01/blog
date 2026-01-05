using MyBlog.Domain.Entities;

namespace MyBlog.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<TodoList> TodoLists { get; }

    DbSet<TodoItem> TodoItems { get; }

    DbSet<Post> Posts { get; }

    DbSet<Category> Categories { get; }
    DbSet<Comment> Comments { get; }


    DbSet<ContentAsset> ContentAssets { get; }
   
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
