using Core.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace Core.Services
{
    public interface IEventService
    {
        Task<IEnumerable<Event>> GetAllAsync();

        Task<Event?> GetByIdAsync(Guid id);

        Task<string?> GetEventImage(Guid id);

        Task<Guid> CreateAsync(Event eventItem);

        Task<bool> UpdateAsync(Event eventItem, Guid EventId);

        Task<bool> DeleteAsync(Guid id);

        Task<IEnumerable<Event>> GetAllControllerEventsAsync(Guid id);

        Task<EventStatistics?> GetStatisticsAsync(Guid eventId);

        Task<bool> CancelEvent(Guid EventId);

        Task<IEnumerable<Event>> MyEvents(Guid userId);

        Task<bool> AssignController(Guid EventId, IEnumerable<Guid> ControllersId);

        Task<IEnumerable<Event>> EventsByCategory(Guid CategoryId);

        Task<IEnumerable<User>> AvailableControllers(DateTime date);

        Task<IEnumerable<User>> ControllersFromEvent(Guid EventId);

        Task<bool> IsEventMine(Guid EventId, Guid UserId);
    }
}