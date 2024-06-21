using Style_Central.API.Data.Models;

namespace Style_Central.API.DTO.Interface;

public interface IUserDto
{
    public Task<OperationResult> RegisterUser(UserModel model);
    public Task<OperationResult<UserModel>> Login(LoginModel model);
}
