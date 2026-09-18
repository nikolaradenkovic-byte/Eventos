using Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace Core.Repositories
{
    public interface IEventRepository
    {
        Task<IEnumerable<Event>> GetAllAsync();

        Task<Event?> GetByIdAsync(Guid id);

        Task<string?> GetEventImage(Guid id);

        Task<Guid> CreateAsync(Event eventData);

        Task<bool> UpdateAsync(Event eventData);

        Task<bool> DeleteAsync(Guid id);

        Task<IEnumerable<Event>> GetAllControllerEventsAsync(Guid id);

        Task<bool> CancelEvent(Guid EventId);

        Task<IEnumerable<Event>> MyEvents(Guid userId);

        Task<bool> AssignController(Guid EventId, IEnumerable<Guid> ControllersId);

        Task<IEnumerable<Event>> EventsByCategory(Guid CategoryId);

        Task<IEnumerable<User>> AvailableControllers(DateTime date);

        Task<IEnumerable<User>> ControllersFromEvent(Guid EventId);

        Task<bool> IsEventMine(Guid EventId, Guid UserId);

    }
}