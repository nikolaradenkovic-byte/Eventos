using Core.Models;

namespace Core.Services
{
    public interface IAuthService
    {
        Task<int> CreateUser(User user);
        Task<Response?> Login(Credentials credentials);
        Task<Response?> RefreshToken(Response oldToken);
        Task<bool> Logout(Response token);
        Task<Guid> GetRoleId(string roleName);
    }
}
