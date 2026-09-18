using Core.Models;

namespace Core.Repositories
{
    public interface IOrderRepository
    {
        Task<OrderTickets?> CreateOrder(Guid userId, List<RequestModel> ticketsDto);
        Task<OrderTickets?> CreateOrderNoAuth(RequestTickets ticketsDto);

        Task<Event?> GetEventInfoById(Guid id);
    }
}
