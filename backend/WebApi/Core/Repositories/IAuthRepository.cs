using Core.Models;

namespace Core.Repositories
{
    public interface IAuthRepository
    {
        Task<int> CreateUser(User user);
        Task<User> Login(string email, string password);
        Task SaveRefreshToken(Guid userId, string tokenHash, DateTime expiresAt);
        Task<IEnumerable<RefreshTokenRecord>> GetActiveRefreshTokensByUserId(Guid userId);
        Task RevokeRefreshToken(Guid tokenId);
        Task<User?> GetUserById(Guid id);
        Task<string> GetUserRole(Guid userId);
        Task<Guid> GetRoleId(string roleName);
    }
}
