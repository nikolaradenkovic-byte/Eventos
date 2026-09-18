using Core.Models;
using Core.Repositories;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace Repository.Repositories
{
    public class TicketRepository : ITicketRepository
    {
        private readonly string _connectionString;

        public TicketRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException(
                    "Connection string 'DefaultConnection' nije pronađen.");
        }

        public async Task<Ticket?> GetByIdAsync(Guid id)
        {
            using var connection = new SqlConnection(_connectionString);

            var ticket = await connection.QueryFirstOrDefaultAsync<Ticket>(
                "eventos.Ticket_GetById",
                new
                {
                    Id = id
                },
                commandType: CommandType.StoredProcedure
            );

            return ticket;
        }

        public async Task<bool> UseTicketAsync(Guid id)
        {
            using var connection = new SqlConnection(_connectionString);

            var rowsAffected = await connection.ExecuteAsync(
                "eventos.Ticket_Use",
                new
                {
                    Id = id
                },
                commandType: CommandType.StoredProcedure
            );

            return rowsAffected > 0;
        }

        public async Task<IEnumerable<Ticket>> GetByEventIdAsync(Guid eventId)
        {
            using var connection = new SqlConnection(_connectionString);

            return await connection.QueryAsync<Ticket>(
                "[eventos].[GetEventStatistics]",
                new
                {
                    EventId = eventId
                });
        }
    }
}