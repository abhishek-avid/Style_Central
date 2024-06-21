using Style_Central.API.Data.Models;

namespace Style_Central.API.Repository.Interface;
public interface IUserService
{
    public Task<OperationResult> RegisterUser(UserModel model);
    public Task<OperationResult<UserModel>> Login(LoginModel model);
}
