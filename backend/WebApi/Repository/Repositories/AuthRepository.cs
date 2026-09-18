using Core.Models;
using Core.Repositories;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace Repository.Repositories
{
    public class AuthRepository(IConfiguration _configuration) : IAuthRepository
    {
        public async Task<int> CreateUser(User user)
        {
            using var connection = GetConnection();
            var sql = "[eventos].[CreateUser]";
            return await connection.ExecuteAsync(sql, new
            {
                Email = user.Email,
                Password = user.Password,
                FirstName = user.FirstName,
                LastName = user.LastName,
                RoleName = "user"
            }, commandType: CommandType.StoredProcedure);
        }

        public async Task<User> Login(string email, string password)
        {
            using var connection = GetConnection();
            var sql = "[eventos].[GetUserByEmail]";
            return await connection.QueryFirstAsync<User>(sql, new { Email = email }, commandType: CommandType.StoredProcedure);
        }

        public async Task SaveRefreshToken(Guid userId, string tokenHash, DateTime expiresAt)
        {
            using var connection = GetConnection();
            await connection.ExecuteAsync(
                "[eventos].[SaveRefreshToken]",
                new { UserId = userId, TokenHash = tokenHash, ExpiresAt = expiresAt },
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<IEnumerable<RefreshTokenRecord>> GetActiveRefreshTokensByUserId(Guid userId)
        {
            using var connection = GetConnection();
            return await connection.QueryAsync<RefreshTokenRecord>(
                "[eventos].[GetActiveRefreshTokensByUserId]",
                new { UserId = userId },
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task RevokeRefreshToken(Guid tokenId)
        {
            using var connection = GetConnection();
            await connection.ExecuteAsync(
                "[eventos].[RevokeRefreshToken]",
                new { TokenId = tokenId },
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<User?> GetUserById(Guid id)
        {
            using var connection = GetConnection();
            return await connection.QueryFirstOrDefaultAsync<User>(
                "[eventos].[GetUserById]",
                new { Id = id },
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<Guid> GetRoleId(string roleName)
        {
            using (var connection = GetConnection())
            {
                Guid roleId = await connection.QueryFirstAsync<Guid>(
                    "[eventos].[GetRoleId]",
                    new { RoleName = roleName },
                    commandType: CommandType.StoredProcedure);
                return roleId;
            }
        }

        public async Task<string> GetUserRole(Guid userId)
        {
            using var connection = GetConnection();
            Guid roleId = await connection.QueryFirstAsync<Guid>(
                "[eventos].[GetUserRole]",
                new { Id = userId },
                commandType: CommandType.StoredProcedure
            );
            
            string role = await connection.QueryFirstAsync<string>(
                "[eventos].[GetRoleName]",
                new { Id = roleId },
                commandType: CommandType.StoredProcedure
            );

            return role;
        }

        private SqlConnection GetConnection()
        {
            return new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
        }
    }
}