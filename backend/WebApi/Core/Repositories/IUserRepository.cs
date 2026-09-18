using Core.Models;

namespace Core.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetUser(Guid Id);
        Task<int> UpdateUser(User userDto);
        Task<int> DeleteUser(Guid Id);
        Task<IEnumerable<User>?> GetAllUsers();
        Task<IEnumerable<Order>> GetOrdersByUserIdAsync(Guid userId);
        Task<IEnumerable<UserTicket>> GetTicketsByUserIdAsync(Guid userId);
    }
}
