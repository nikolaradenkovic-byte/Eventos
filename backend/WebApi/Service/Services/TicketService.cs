using Core.Models;
using Core.Repositories;

namespace Core.Services
{
    public class TicketService : ITicketService
    {
        private readonly ITicketRepository _ticketRepository;

        public TicketService(
            ITicketRepository ticketRepository)
        {
            _ticketRepository = ticketRepository;
        }

        public async Task<Ticket?> GetByIdAsync(Guid id)
        {
            return await _ticketRepository.GetByIdAsync(id);
        }

        public async Task<bool> UseTicketAsync(Guid id)
        {
            return await _ticketRepository.UseTicketAsync(id);
        }

    }
}