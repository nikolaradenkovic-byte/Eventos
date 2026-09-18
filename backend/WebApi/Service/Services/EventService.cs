using Core.Models;
using Core.Repositories;
using Core.Services;

namespace Service.Services
{
    public class EventService(IEventRepository _eventRepository, ITicketRepository _ticketRepository) : IEventService
    {
        public async Task<IEnumerable<Event>> GetAllAsync()
        {
            return await _eventRepository.GetAllAsync();
        }

        public async Task<Event?> GetByIdAsync(Guid id)
        {
            return await _eventRepository.GetByIdAsync(id);
        }

        public async Task<Guid> CreateAsync(Event eventItem)
        {
            return await _eventRepository.CreateAsync(eventItem);
        }

        public async Task<bool> UpdateAsync(Event eventItem, Guid eventId)
        {
            eventItem.Id = eventId;
            var existingEvent =
                await _eventRepository.GetByIdAsync(eventItem.Id);

            if (existingEvent == null)
            {
                return false;
            }

            return await _eventRepository.UpdateAsync(eventItem);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var existingEvent =
                await _eventRepository.GetByIdAsync(id);

            if (existingEvent == null)
            {
                return false;
            }

            return await _eventRepository.DeleteAsync(id);
        }

        public async Task<EventStatistics?> GetStatisticsAsync(Guid eventId)
        {
            Event? eventItem = await _eventRepository.GetByIdAsync(eventId);

            if (eventItem == null)
            {
                return null;
            }

            IEnumerable<Ticket> tickets =
                await _ticketRepository.GetByEventIdAsync(eventId);

            int soldTickets = tickets.Count();

            int capacity = eventItem.Capacity ?? 0;

            int remainingTickets =
                Math.Max(0, capacity - soldTickets);

            decimal revenue =
                soldTickets * eventItem.TicketCost;

            int usedTickets =
                tickets.Count(x => x.IsUsed);

            decimal occupancyPercentage =
                capacity > 0
                    ? Math.Round((decimal)soldTickets / capacity * 100, 2)
                    : 0;

            return new EventStatistics
            {
                SoldTickets = soldTickets,
                RemainingTickets = remainingTickets,
                Revenue = revenue,
                UsedTickets = usedTickets,
                OccupancyPercentage = occupancyPercentage
            };
        }

        public async Task<IEnumerable<Event>> GetAllControllerEventsAsync(Guid id)
        {
            return await _eventRepository.GetAllControllerEventsAsync(id);
        }

        public async Task<bool> CancelEvent(Guid EventId)
        {
            return await _eventRepository.CancelEvent(EventId);
        }

        public async Task<IEnumerable<Event>> MyEvents(Guid userId)
        {
            return await _eventRepository.MyEvents(userId);
        }

        public async Task<IEnumerable<Event>> EventsByCategory(Guid CategoryId)
        {
            return await _eventRepository.EventsByCategory(CategoryId);
        }

        public async Task<bool> AssignController(Guid EventId, IEnumerable<Guid> ControllersId)
        {
            return await _eventRepository.AssignController(EventId, ControllersId);
        }

        public async Task<IEnumerable<User>> AvailableControllers(DateTime date)
        {
            return await _eventRepository.AvailableControllers(date);
        }

        public async Task<IEnumerable<User>> ControllersFromEvent(Guid EventId)
        {
            return await _eventRepository.ControllersFromEvent(EventId);
        }

        public async Task<string?> GetEventImage(Guid id)
        {
            return await _eventRepository.GetEventImage(id);
        }

        public async Task<bool> IsEventMine(Guid EventId, Guid UserId)
        {
            return await _eventRepository.IsEventMine(EventId, UserId);
        }
    }
}