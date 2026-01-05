using MediatR;
using MyBlog.Application.Common.Interfaces;
using MyBlog.Application.Users.Dto;
using MyBlog.Application.Common.Models;
namespace MyBlog.Application.Users.Queries.GetAllUsers;

public class GetAllUsersQuery : IRequest<PaginatedList<UserDto>>
{
    public int PageNumber { get; }
    public int PageSize { get; }

    public GetAllUsersQuery(int pageNumber, int pageSize)
    {
        PageNumber = pageNumber;
        PageSize = pageSize;
    }
}

public class GetAllUsersQueryHandler : IRequestHandler<GetAllUsersQuery, PaginatedList<UserDto>>
{
    private readonly IIdentityService _identityService;


    public GetAllUsersQueryHandler(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    public async Task<PaginatedList<UserDto>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
    {
        var usersQuery = _identityService.Users;

        var pagedUsers = await PaginatedList<UserDto>.CreateAsync(
            usersQuery,
            request.PageNumber,
            request.PageSize,
            cancellationToken
        );

        foreach (var user in pagedUsers.Items)
        {
            user.Roles = await _identityService.GetRolesAsync(user.Id);
        }

        return pagedUsers;
    }
}
