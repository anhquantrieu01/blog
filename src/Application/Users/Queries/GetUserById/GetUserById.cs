using MediatR;
using MyBlog.Application.Common.Interfaces;
using MyBlog.Application.Users.Dto;

namespace MyBlog.Application.Users.Queries.GetUserById;

public record GetUserByIdQuery(string Id) : IRequest<UserDto?>;

public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, UserDto?>
{
    private readonly IIdentityService _identityService;

    public GetUserByIdQueryHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<UserDto?> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        return await _identityService.GetUserByIdAsync(request.Id);
    }
}
