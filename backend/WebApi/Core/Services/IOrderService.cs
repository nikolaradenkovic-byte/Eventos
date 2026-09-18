using Core.Models;

namespace Core.Services
{
    public interface IOrderService
    {
        Task<Order?> CreateOrder(Guid userId, List<RequestModel> ticketsDto, string email, string firstName, string lastName);
        Task<Order?> CreateOrderNoAuth(RequestTickets ticketsDto);
    }
}
