using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using MyBlog.Application.Common.Interfaces;

namespace MyBlog.Infrastructure.Services;

public class SlugService : ISlugService
{
    private readonly IApplicationDbContext _context;

    public SlugService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<string> GenerateUniqueSlugAsync(string input, string entityName)
    {
        var slug = GenerateSlug(input);

        var index = 1;
        var baseSlug = slug;
        while (await SlugExistsAsync(slug, entityName))
        {
            slug = $"{baseSlug}-{index++}";
        }

        return slug;
    }

    private string GenerateSlug(string input)
    {
        input = input.ToLowerInvariant().Trim();

        // Loại bỏ dấu tiếng Việt
        input = RemoveDiacritics(input);

        // Xóa ký tự không hợp lệ
        input = Regex.Replace(input, @"[^a-z0-9\s-]", "");

        // Thay whitespace bằng gạch ngang
        input = Regex.Replace(input, @"\s+", "-");

        return input;
    }

    private bool SlugExists(string slug, string entityName)
    {
        return entityName switch
        {
            "Category" => _context.Categories.Any(e => e.Slug == slug),
            "Post" => _context.Posts.Any(e => e.Slug == slug),
            _ => throw new ArgumentException("Unknown entity name"),
        };
    }

    private Task<bool> SlugExistsAsync(string slug, string entityName) =>
        Task.FromResult(SlugExists(slug, entityName));

    private string RemoveDiacritics(string text)
    {
        var formD = text.Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder();
        foreach (var ch in formD)
        {
            var uc = CharUnicodeInfo.GetUnicodeCategory(ch);
            if (uc != UnicodeCategory.NonSpacingMark)
                sb.Append(ch);
        }
        return sb.ToString().Normalize(NormalizationForm.FormC);
    }
}
