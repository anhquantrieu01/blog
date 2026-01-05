using System.Text.RegularExpressions;

namespace MyBlog.Application.Common.Helpers;

public static class HtmlImageParser
{
    public static List<string> ExtractPublicIds(string? html)
    {
        if (string.IsNullOrWhiteSpace(html))
            return new List<string>();

        var result = new List<string>();

        var regex = new Regex(
            "data-public-id=\"([^\"]+)\"",
            RegexOptions.IgnoreCase | RegexOptions.Compiled
        );

        var matches = regex.Matches(html);

        foreach (Match match in matches)
        {
            if (match.Groups.Count > 1)
            {
                result.Add(match.Groups[1].Value);
            }
        }

        return result;
    }
}
