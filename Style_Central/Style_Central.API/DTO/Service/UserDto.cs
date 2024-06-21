using Style_Central.API.Data.Models;
using Style_Central.API.DTO.Interface;
using Style_Central.API.Repository.Interface;

namespace Style_Central.API.DTO.Service;

public class UserDto : IUserDto
{
    private readonly IUserService _user;
 
    public UserDto(IUserService userService)
    {
        this._user = userService;
    }

    public Task<OperationResult<UserModel>> Login(LoginModel model)
    {
        return _user.Login(model);
    }

    public Task<OperationResult> RegisterUser(UserModel model)
    {
        return _user.RegisterUser(model);
    }
}
