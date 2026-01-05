using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using MyBlog.Application.Common.Interfaces;
using MyBlog.Application.Common.Models;

public class CloudinaryService : IImageService
{
    private readonly Cloudinary _cloudinary;
    private readonly string[] _allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
    private const long MaxFileSize = 5 * 1024 * 1024; // 5MB

    public CloudinaryService(Cloudinary cloudinary)
    {
        _cloudinary = cloudinary;
    }

    // Upload từ Stream + fileName -> trả về Url + PublicId
    public async Task<ImageUploadResultDto> UploadAsync(Stream fileStream, string fileName)
    {
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(fileName, fileStream),
            Folder = "myblog"
        };

        var result = await _cloudinary.UploadAsync(uploadParams);

        return new ImageUploadResultDto
        {
            Url = result.SecureUrl.ToString(),
            PublicId = result.PublicId
        };
    }

    public async Task<bool> DeleteAsync(string publicId)
    {
        var result = await _cloudinary.DestroyAsync(new DeletionParams(publicId));
        return result.Result == "ok";
    }

  
    public async Task<ImageUploadResultDto> ReplaceAsync(string oldPublicId, Stream stream, string fileName)
    {
        await DeleteAsync(oldPublicId);
        return await UploadAsync(stream, fileName);
    }
}
