namespace MyBlog.Application.Common.Interfaces;

public interface ISlugService
{
    Task<string> GenerateUniqueSlugAsync(string input, string entityName);
}
