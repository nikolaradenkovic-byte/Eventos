using Core.Models;
using Core.Repositories;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Data;

namespace Repository.Repositories
{
    public class EventRepository : IEventRepository
    {
        private readonly string _connectionString;

        public EventRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException(
                    "Connection string 'DefaultConnection' nije pronađen.");
        }

        public async Task<Guid> CreateAsync(Event eventItem)
        {
            using var connection = new SqlConnection(_connectionString);

            return await connection.ExecuteScalarAsync<Guid>(
                "eventos.Event_Create",
                new
                {
                    eventItem.UserId,
                    eventItem.EventName,
                    eventItem.StartTime,
                    eventItem.EndTime,
                    eventItem.Capacity,
                    eventItem.TicketCost,
                    eventItem.LocationName,
                    eventItem.CategoryId,
                    eventItem.ImagePath,
                    eventItem.Description
                },
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<IEnumerable<Event>> GetAllAsync()
        {
            using var connection = new SqlConnection(_connectionString);

            return await connection.QueryAsync<Event>(
                "eventos.Event_GetAll",
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<Event?> GetByIdAsync(Guid id)
        {
            using var connection = new SqlConnection(_connectionString);

            return await connection.QueryFirstOrDefaultAsync<Event>(
                "eventos.Event_GetById",
                new
                {
                    Id = id
                },
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<bool> UpdateAsync(Event eventItem)
        {
            using var connection = new SqlConnection(_connectionString);

            var rowsAffected = await connection.ExecuteAsync(
                "eventos.Event_Update",
                new
                {
                    eventItem.Id,
                    eventItem.EventName,
                    eventItem.StartTime,
                    eventItem.ImagePath,
                    eventItem.EndTime,
                    eventItem.Capacity,
                    eventItem.TicketCost,
                    eventItem.LocationName,
                    eventItem.CategoryId,
                    eventItem.Description,
                    eventItem.IsCanceled
                },
                commandType: CommandType.StoredProcedure
            );

            return rowsAffected > 0;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            using var connection = new SqlConnection(_connectionString);

            var rowsAffected = await connection.ExecuteAsync(
                "eventos.Event_Delete",
                new
                {
                    Id = id
                },
                commandType: CommandType.StoredProcedure
            );

            return rowsAffected > 0;
        }

        public async Task<IEnumerable<Event>> GetAllControllerEventsAsync(Guid id)
        {
            using var connection = new SqlConnection(_connectionString);

            return await connection.QueryAsync<Event>(
                "[eventos].[Event_GetAllControllers]",
                new
                {
                    Id = id
                },
                commandType: CommandType.StoredProcedure
            );

        }

        public async Task<bool> CancelEvent(Guid EventId)
        {
            using var connection = new SqlConnection(_connectionString);

            int rowsAffected = await connection.ExecuteAsync("[eventos].[CancelEvent]", new { Id = EventId }, commandType: CommandType.StoredProcedure);

            if (rowsAffected > 0) return true;
            return false;
        }

        public async Task<IEnumerable<Event>> MyEvents(Guid userId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                var sql = "[eventos].[MyEvents]";

                IEnumerable<Event> events = await connection.QueryAsync<Event>(sql, new { UserId = userId }, commandType: CommandType.StoredProcedure);
                return events;
            }
        }

        public async Task<IEnumerable<Event>> EventsByCategory(Guid CategoryId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                var sql = "[eventos].[GetEventsByCategory]";

                IEnumerable<Event> events = await connection.QueryAsync<Event>(sql, new { CategoryId = CategoryId }, commandType: CommandType.StoredProcedure);
                return events;
            }
        }

        public async Task<bool> AssignController(Guid EventId, IEnumerable<Guid> ControllersId)
        {
            foreach (Guid ControllerId in ControllersId)
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    await using var transaction = await connection.BeginTransactionAsync();
                    try
                    {

                        var controller = await connection.QueryFirstAsync("[eventos].[IsController]",
                            new { Id = ControllerId }, 
                            commandType: CommandType.StoredProcedure, 
                            transaction: transaction
                            );

                        if (controller == null) {
                            continue;
                        }
                        await connection.ExecuteAsync(
                            "[eventos].[AssignController]", 
                            new { UserId = ControllerId, EventId = EventId }, 
                            commandType: CommandType.StoredProcedure,
                            transaction: transaction
                            );
                        await transaction.CommitAsync();
                    }
                    catch
                    {
                        await transaction.RollbackAsync();
                        return false;
                    }
                }
            }
            return true;
        }

        public async Task<IEnumerable<User>> AvailableControllers(DateTime date)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                var sql = "[eventos].[AvailableControllers]";

                IEnumerable<User> controllers = await connection.QueryAsync<User>(sql, new { Date = date }, commandType: CommandType.StoredProcedure);
                return controllers;
            }
        }

        public async Task<IEnumerable<User>> ControllersFromEvent(Guid EventId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                var sql = "[eventos].[GetEventControllers]";

                IEnumerable<User> controllers = await connection.QueryAsync<User>(sql, new { Id = EventId }, commandType: CommandType.StoredProcedure);
                return controllers;
            }
        }

        public async Task<string?> GetEventImage(Guid id)
        {
            using var connection = new SqlConnection(_connectionString);

            return await connection.QueryFirstOrDefaultAsync<string>(
                "[eventos].[GetEventImage]",
                new
                {
                    Id = id
                },
                commandType: CommandType.StoredProcedure
            );
        }

        public async Task<bool> IsEventMine(Guid EventId, Guid UserId)
        {
            using var connection = new SqlConnection(_connectionString);

            Event? _event = await connection.QueryFirstOrDefaultAsync<Event>(
                "[eventos].[IsEventMine]",
                new
                {
                    Id = EventId
                },
                commandType: CommandType.StoredProcedure
            );

            if (_event == null) return false;
            if (_event.UserId == UserId) return true;
            return false;
        }
    }
}