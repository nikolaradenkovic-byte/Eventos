using Core.Models;

namespace Core.Repositories
{
    public interface ITicketRepository
    {
        Task<Ticket?> GetByIdAsync(Guid id);

        Task<bool> UseTicketAsync(Guid id);

        Task<IEnumerable<Ticket>> GetByEventIdAsync(Guid eventId);
    }
}