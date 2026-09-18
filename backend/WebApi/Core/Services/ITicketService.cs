using Core.Models;

namespace Core.Services
{
    public interface ITicketService
    {
        Task<Ticket?> GetByIdAsync(Guid id);

        Task<bool> UseTicketAsync(Guid id);
    }
}