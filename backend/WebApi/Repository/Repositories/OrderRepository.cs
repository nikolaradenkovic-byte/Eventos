using System.Data;
using Core.Models;
using Core.Repositories;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace Repository.Repositories
{
    internal class OrderRepository(IConfiguration _configuration) : IOrderRepository
    {
        public async Task<OrderTickets?> CreateOrder(
            Guid userId,
            List<RequestModel> ticketsDto)
        {
            await using var connection = GetConnection();
            await connection.OpenAsync();

            await using var transaction = await connection.BeginTransactionAsync();

            try
            {

                await connection.ExecuteAsync(
                    "[eventos].[Order_Create]",
                    commandType: CommandType.StoredProcedure,
                    transaction: transaction
                );

                var order = await connection.QuerySingleAsync<Order>(
                    "[eventos].[GetLastOrder]",
                    transaction: transaction
                );

                await connection.ExecuteAsync(
                    "[eventos].[OrderMap_Create]",
                    new
                    {
                        UserId = userId,
                        OrderId = order.Id
                    },
                    commandType: CommandType.StoredProcedure,
                    transaction: transaction
                );

                foreach (var ticket in ticketsDto)
                {
                    for (var i = 0; i < ticket.quantity; i++)
                    {
                        await connection.ExecuteAsync(
                            "[eventos].[Ticket_Create]",
                            new
                            {
                                EventId = ticket.EventId,
                                OrderId = order.Id
                            },
                            commandType: CommandType.StoredProcedure,
                            transaction: transaction
                        );
                    }
                }

                IEnumerable<Ticket> tickets = await connection.QueryAsync<Ticket>(
                    "[eventos].[GetAllTicketsByOrderId]",
                    new { OrderId = order.Id },
                    commandType: CommandType.StoredProcedure,
                    transaction: transaction
                );

                OrderTickets orderTickets = new OrderTickets
                {
                    Order = order,
                    Tickets = tickets
                };
                    
                await transaction.CommitAsync();

                return orderTickets;
            }
            catch
            {
                await transaction.RollbackAsync();
                return null;
            }
        }

        public async Task<OrderTickets?> CreateOrderNoAuth(
            RequestTickets ticketsDto)
        {
            await using var connection = GetConnection();
            await connection.OpenAsync();

            await using var transaction = await connection.BeginTransactionAsync();

            try
            {
                await connection.ExecuteAsync(
                    "[eventos].[Order_Create]",
                    commandType: CommandType.StoredProcedure,
                    transaction: transaction
                );

                var order = await connection.QuerySingleAsync<Order>(
                    "[eventos].[GetLastOrder]",
                    transaction: transaction
                );

                foreach (var ticket in ticketsDto.events)
                {
                    for (var i = 0; i < ticket.quantity; i++)
                    {
                        await connection.ExecuteAsync(
                            "[eventos].[Ticket_Create]",
                            new
                            {
                                EventId = ticket.EventId,
                                OrderId = order.Id
                            },
                            commandType: CommandType.StoredProcedure,
                            transaction: transaction
                        );
                    }
                }

                IEnumerable<Ticket> tickets = await connection.QueryAsync<Ticket>(
                "[eventos].[GetAllTicketsByOrderId]",
                new { OrderId = order.Id },
                commandType: CommandType.StoredProcedure,
                transaction: transaction
);

                OrderTickets orderTickets = new OrderTickets
                {
                    Order = order,
                    Tickets = tickets
                };

                await transaction.CommitAsync();

                return orderTickets;
            }
            catch
            {
                await transaction.RollbackAsync();
                return null;
            }
        }
        public async Task<Event?> GetEventInfoById(Guid id)
        {
            await using var connection = GetConnection();
            await connection.OpenAsync();

            return await connection.QueryFirstOrDefaultAsync<Event>(
                "[eventos].[GetEventByTicketId]",
                new
                {
                    Id = id
                },
                commandType: CommandType.StoredProcedure
            );
        }

        private SqlConnection GetConnection()
        {
            return new SqlConnection(
                _configuration.GetConnectionString("DefaultConnection"));
        }
    }
}
