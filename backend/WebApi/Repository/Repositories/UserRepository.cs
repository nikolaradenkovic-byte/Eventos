using Core.Models;
using Core.Repositories;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace Repository.Repositories
{
    public class UserRepository(IConfiguration _configuration) : IUserRepository
    {
        public async Task<User?> GetUser(Guid Id)
        {
            using var connection = GetConnection();

            var sql = "[eventos].[GetUserById]";

            User? user = await connection.QueryFirstOrDefaultAsync<User>(
                sql,
                new
                {
                    Id = Id
                },
                commandType: CommandType.StoredProcedure
            );

            return user;
        }

        public async Task<int> UpdateUser(User user)
        {
            using var connection = GetConnection();

            var sql = "[eventos].[UpdateUser]";

            int rowsAffected = await connection.ExecuteAsync(
                sql,
                new
                {
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Id = user.Id
                },
                commandType: CommandType.StoredProcedure
            );

            return rowsAffected;
        }

        public async Task<int> DeleteUser(Guid Id)
        {
            using var connection = GetConnection();

            var sql = "[eventos].[DeleteUserById]";

            int rowsAffected = await connection.ExecuteAsync(
                sql,
                new
                {
                    Id = Id
                },
                commandType: CommandType.StoredProcedure
            );

            return rowsAffected;
        }

        public async Task<IEnumerable<User>?> GetAllUsers()
        {
            using var connection = GetConnection();

            var sql = "[eventos].[GetAllUsers]";

            IEnumerable<User> users =
                await connection.QueryAsync<User>(
                    sql,
                    commandType: CommandType.StoredProcedure
                );

            return users;
        }

        public async Task<IEnumerable<Order>> GetOrdersByUserIdAsync(Guid userId)
        {
            using var connection = GetConnection();

            return await connection.QueryAsync<Order>(
                "[eventos].[Order_GetByUserId]",
                new
                {
                    UserId = userId
                },
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<IEnumerable<UserTicket>> GetTicketsByUserIdAsync(Guid userId)
        {
            using var connection = GetConnection();

            return await connection.QueryAsync<UserTicket>(
                "[eventos].[Ticket_GetByUserId]",
                new
                {
                    UserId = userId
                },
                commandType: CommandType.StoredProcedure
            );
        }

        private SqlConnection GetConnection()
        {
            return new SqlConnection(
                _configuration.GetConnectionString("DefaultConnection")
            );
        }
    }
}