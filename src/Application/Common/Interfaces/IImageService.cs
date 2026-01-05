using MyBlog.Application.Common.Models;
namespace MyBlog.Application.Common.Interfaces;
public interface IImageService
{
    Task<ImageUploadResultDto> UploadAsync(Stream fileStream, string fileName);
    Task<bool> DeleteAsync(string publicId);
    Task<ImageUploadResultDto> ReplaceAsync(string oldPublicId, Stream newStream, string newFileName);
}
