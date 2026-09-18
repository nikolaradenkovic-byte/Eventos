using Core.Models;
using Core.Repositories;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace Repository.Repositories
{
    public class RoleRepository(IConfiguration _configuration) : IRoleRepository
    {
        public async Task<bool> ChangeUserRole(Guid Id, Guid RoleId)
        {
            using (var connection = GetConnection())
            {
                connection.Open();
                var sql = "[eventos].[ChangeUserRole]";

                int affectedRows = await connection.ExecuteAsync(sql, new { Id = Id, RoleId = RoleId });

                if (affectedRows > 0) return true;
                return false;
            }
        }

        public async Task<bool> CreateRole(string RoleName)
        {
            using (var connection = GetConnection())
            {
                connection.Open();
                var sql = "[eventos].[CreateRole]";

                int affectedRows = await connection.ExecuteAsync(sql, new { RoleName = RoleName });

                if (affectedRows > 0) return true;
                return false;
            }
        }

        public async Task<IEnumerable<Role>> GetAllRoles()
        {
            using (var connection = GetConnection())
            {
                connection.Open();
                var sql = "[eventos].[GetAllRoles]";

                IEnumerable<Role> roles = await connection.QueryAsync<Role>(sql);
                return roles;
            }
        }

        private SqlConnection GetConnection()
        {
            return new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
        }
    }
}
