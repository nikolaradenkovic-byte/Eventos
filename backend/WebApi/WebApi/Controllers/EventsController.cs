
using Core.Models;
using Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Net.Mime;
using System.Security.Claims;
using WebApi.DTO;
using WebApi.Mapper;
using static System.Net.Mime.MediaTypeNames;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Tags("EventController")]
    [EnableCors("_eventosCors")]
    [ApiExplorerSettings(GroupName = "Event")]
    public class EventsController(IEventService _eventService, DtoMapperProfile mapper) : ControllerBase
    {

        [HttpGet]
        [EndpointName("GetAllEvents")]
        [EndpointSummary("Get all events")]
        [EndpointDescription("Returns a list of all events.")]
        [SwaggerResponse(statusCode: 200, type: typeof(IEnumerable<EventWithoutImageDto>), description: "Events retrieved successfully.")]
        [SwaggerResponse(statusCode: 204, description: "No events found.")]
        [SwaggerResponse(statusCode: 400, description: "Bad request.")]
        [SwaggerResponse(statusCode: 401, description: "Unauthorized.")]
        public async Task<ActionResult<IEnumerable<Event>>> GetAllEvents()
        {
            try
            {
                var events = await _eventService.GetAllAsync();
                IEnumerable<EventWithoutImageDto> eventsDto = events!
.Where(x => x != null)
.Select(x => mapper.MapToEventDtoI(x!))
.ToArray();
                if (eventsDto == null || !eventsDto.Any())
                {
                    return NoContent();
                }

                return Ok(eventsDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{Id}/image")]
        [EndpointName("Get image by event Id")]
        [EndpointSummary("Returns an image")]
        [EndpointDescription("Returns an image from event id.")]
        [SwaggerResponse(statusCode: 200, description: "Image retrieved successfully.")]
        [SwaggerResponse(statusCode: 204, description: "No events found.")]
        [SwaggerResponse(statusCode: 400, description: "Bad request.")]
        [SwaggerResponse(statusCode: 401, description: "Unauthorized.")]
        public async Task<ActionResult> GetEventImage([FromRoute] Guid Id)
        {
            try
            {
                var b64str = await _eventService.GetEventImage(Id);

                if (b64str == null) return NoContent();
                var parts = b64str.Split(",", 2);

                var type = parts[0]
                    .Split(";")[0]
                    .Replace("data:", "");
                var bytes = Convert.FromBase64String(parts[1]);

                return File(bytes, type);
            }
            catch (Exception ex) {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet("controller")]
        [Authorize(Roles = "controller")]
        [EndpointName("GetAllControllerEvents")]
        [EndpointSummary("Get all events from a specific controller")]
        [EndpointDescription("Returns a list of all events with controller.")]
        [SwaggerResponse(statusCode: 200, type: typeof(IEnumerable<EventWithoutImageDto>), description: "Events retrieved successfully.")]
        [SwaggerResponse(statusCode: 204, description: "No events found.")]
        [SwaggerResponse(statusCode: 400, description: "Bad request.")]
        [SwaggerResponse(statusCode: 401, description: "Unauthorized.")]
        public async Task<ActionResult<IEnumerable<Event>>> GetAllControllerEvents()
        {
            try
            {
                Guid? id = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub")!);
                if (id == null) return BadRequest();
                Guid UserId = id ?? Guid.Empty;
                if (UserId == Guid.Empty) return BadRequest();
                var events = await _eventService.GetAllControllerEventsAsync(UserId);
                IEnumerable<EventWithoutImageDto> eventsDto = events!
.Where(x => x != null)
.Select(x => mapper.MapToEventDtoI(x!))
.ToArray();

                if (eventsDto == null || !eventsDto.Any())
                {
                    return NoContent();
                }

                return Ok(eventsDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{Id}")]
        [EndpointName("GetEvent")]
        [EndpointSummary("Get event")]
        [EndpointDescription("Returns event information for the specified event ID.")]
        [SwaggerResponse(statusCode: 200, type: typeof(EventDto), description: "Event retrieved successfully.")]
        [SwaggerResponse(statusCode: 204, description: "Event not found.")]
        [SwaggerResponse(statusCode: 400, description: "Bad request.")]
        [SwaggerResponse(statusCode: 401, description: "Unauthorized.")]
        public async Task<ActionResult<Event?>> GetEvent([FromRoute] Guid Id)
        {
            try
            {
                Event? _event = await _eventService.GetByIdAsync(Id);
                EventWithoutImageDto eventDto = mapper.MapToEventDtoI(_event!);
                if (eventDto == null)
                {
                    return NoContent();
                }

                return Ok(eventDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Consumes("multipart/form-data")]
        [Authorize(Roles = "organisator")]
        [EndpointName("CreateEvent")]
        [EndpointSummary("Create event")]
        [EndpointDescription("Creates a new event.")]
        [SwaggerResponse(statusCode: 200, type: typeof(CreateEventDto), description: "Event created successfully.")]
        [SwaggerResponse(statusCode: 400, description: "Bad request.")]
        [SwaggerResponse(statusCode: 401, description: "Unauthorized.")]
        public async Task<ActionResult> CreateEvent([FromForm] CreateEventDto dto)
        {
            try
            {
                Guid? MyId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub")!);
                Guid MyUserId = MyId ?? Guid.Empty;
                if (MyUserId != Guid.Empty) dto.UserId = MyUserId;

                dto.ImagePath = null;

                if (dto.ImageFile != null)
                {
                    if (dto.ImageFile.Length > 8 * 1024 * 1024)
                    {
                        throw new InvalidOperationException("File size can not exceed 8 mb");
                    }

                    var allowedContentTypes = new[]
                    {
                        "image/jpeg",
                        "image/png",
                        "image/gif",
                        "image/webp"
                    };

                    if (!allowedContentTypes.Contains(dto.ImageFile.ContentType))
                    {
                        throw new InvalidOperationException("Only JPEG, PNG, GIF and WebP images are allowed.");
                    }
                    using var memoryStream = new MemoryStream();
                    await dto.ImageFile.CopyToAsync(memoryStream);
                    var base64String = Convert.ToBase64String(memoryStream.ToArray());
                    dto.ImagePath = $"data:{dto.ImageFile.ContentType};base64,{base64String}";
                }
                var data = mapper.CreateMapToEvent(dto);

                Guid createdId = await _eventService.CreateAsync(data);

                await _eventService.AssignController(createdId, dto.ControllerIds);

                return Ok(dto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPut("{EventId}")]
        [Consumes("multipart/form-data")]
        [Authorize(Roles = "organisator")]
        [EndpointName("UpdateEvent")]
        [EndpointSummary("Update event")]
        [EndpointDescription("Updates the specified event.")]
        [SwaggerResponse(statusCode: 200, description: "Event updated successfully.")]
        [SwaggerResponse(statusCode: 204, description: "Event was not updated or does not exist.")]
        [SwaggerResponse(statusCode: 400, description: "Bad request.")]
        [SwaggerResponse(statusCode: 401, description: "Unauthorized.")]
        public async Task<ActionResult> UpdateEvent(
            [FromForm] CreateEventDto dto, [FromRoute] Guid EventId)
        {
            try
            {
                Guid? MyId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub")!);
                Guid MyUserId = MyId ?? Guid.Empty;
                dto.UserId = MyUserId;

                bool myEvent = await _eventService.IsEventMine(EventId, MyUserId);
                if (!myEvent) return Forbid();

                dto.ImagePath = null;

                if (dto.ImageFile != null)
                {
                    if (dto.ImageFile.Length > 8 * 1024 * 1024)
                    {
                        throw new InvalidOperationException("File size can not exceed 8 mb");
                    }

                    var allowedContentTypes = new[]
                    {
                        "image/jpeg",
                        "image/png",
                        "image/gif",
                        "image/webp"
                    };

                    if (!allowedContentTypes.Contains(dto.ImageFile.ContentType))
                    {
                        throw new InvalidOperationException("Only JPEG, PNG, GIF and WebP images are allowed.");
                    }
                    using var memoryStream = new MemoryStream();
                    await dto.ImageFile.CopyToAsync(memoryStream);
                    var base64String = Convert.ToBase64String(memoryStream.ToArray());
                    dto.ImagePath = $"data:{dto.ImageFile.ContentType};base64,{base64String}";
                }
                var data = mapper.CreateMapToEvent(dto);

                bool createdId = await _eventService.UpdateAsync(data, EventId);

                return Ok(dto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{Id:guid}")]
        [Authorize(Roles = "organisator")]
        [EndpointName("DeleteEvent")]
        [EndpointSummary("Delete event")]
        [EndpointDescription("Deletes the specified event by ID.")]
        [SwaggerResponse(statusCode: 200, description: "Event deleted successfully.")]
        [SwaggerResponse(statusCode: 204, description: "Event was not found.")]
        [SwaggerResponse(statusCode: 400, description: "Bad request.")]
        [SwaggerResponse(statusCode: 401, description: "Unauthorized.")]
        public async Task<ActionResult> DeleteEvent([FromRoute] Guid Id)
        {
            try
            {
                Guid? MyId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub")!);
                Guid MyUserId = MyId ?? Guid.Empty;
                bool myEvent = await _eventService.IsEventMine(Id, MyUserId);
                if (!myEvent) return Forbid();

                var deleted = await _eventService.DeleteAsync(Id);

                if (!deleted)
                {
                    return NoContent();
                }

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{Id}/cancel")]
        [Authorize(Roles = "organisator")]
        [EndpointName("CancelEvent")]
        [EndpointSummary("Cancel an Event")]
        [EndpointDescription("Cancels the event.")]
        [SwaggerResponse(statusCode: 200, description: "Canceled successfully.")]
        [SwaggerResponse(statusCode: 204, description: "No event found.")]
        [SwaggerResponse(statusCode: 400, description: "Bad request.")]
        [SwaggerResponse(statusCode: 401, description: "Unauthorized.")]
        public async Task<ActionResult> CancelEvent([FromRoute] Guid Id)
        {
            try {
                Guid? MyId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub")!);
                Guid MyUserId = MyId ?? Guid.Empty;
                bool myEvent = await _eventService.IsEventMine(Id, MyUserId);
                if (!myEvent) return Forbid();

                bool canceled = await _eventService.CancelEvent(Id);

                if (canceled) return Ok();
                return NoContent();
            } 
            catch (Exception ex) {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id:guid}/statistics")]
        //[Authorize]
        [EndpointName("GetEventStatistics")]
        [EndpointSummary("Get statistics of an Event")]
        [EndpointDescription("Returns event's statistics.")]
        [SwaggerResponse(statusCode: 200, description: "Statistics retrieved successfully.")]
        [SwaggerResponse(statusCode: 204, description: "No event found.")]
        [SwaggerResponse(statusCode: 400, description: "Bad request.")]
        [SwaggerResponse(statusCode: 401, description: "Unauthorized.")]
        public async Task<ActionResult> GetStatisticsAsync([FromRoute] Guid id)
        {
            try
            {
                var statistics = await _eventService.GetStatisticsAsync(id);

                if (statistics == null)
                {
                    return NotFound();
                }

                return Ok(statistics);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("myevents")]
        [Authorize(Roles = "organisator")]
        [EndpointName("GetMyEvents")]
        [EndpointSummary("Get all of my events")]
        [EndpointDescription("Returns all events created by me.")]
        [SwaggerResponse(statusCode: 200, type: typeof(IEnumerable<EventWithoutImageDto>), description: "Events retrieved successfully.")]
        [SwaggerResponse(statusCode: 204, description: "No events found.")]
        [SwaggerResponse(statusCode: 400, description: "Bad request.")]
        [SwaggerResponse(statusCode: 401, description: "Unauthorized.")]
        public async Task<ActionResult> MyEvents()
        {
            try
            {
                Guid id = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub")!);

                if (id == Guid.Empty) return Forbid();
                IEnumerable<Event> myEvents = await _eventService.MyEvents(id);
                IEnumerable<EventWithoutImageDto> eventsDto = myEvents!
                  .Where(x => x != null)
                  .Select(x => mapper.MapToEventDtoI(x!))
                  .ToArray();
                if (eventsDto == null) return NoContent();
                return Ok(eventsDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        } 

        [HttpGet("category/{CategoryId}")]
        [EndpointName("GetEventsByCategory")]
        [EndpointSummary("Get all events from a category")]
        [EndpointDescription("Returns all events from a category.")]
        [SwaggerResponse(statusCode: 200, type: typeof(IEnumerable<Event>), description: "Events retrieved successfully.")]
        [SwaggerResponse(statusCode: 204, description: "No events found.")]
        [SwaggerResponse(statusCode: 400, description: "Bad request.")]
        [SwaggerResponse(statusCode: 401, description: "Unauthorized.")]
        public async Task<ActionResult> EventsByCategory([FromRoute] Guid CategoryId)
        {
            try
            {
                IEnumerable<Event> events = await _eventService.EventsByCategory(CategoryId);
                IEnumerable<EventWithoutImageDto> eventsDto =  events!
                  .Where(x => x != null)
                  .Select(x => mapper.MapToEventDtoI(x!))
                  .ToArray();

                if (eventsDto == null) return NoContent();
                return Ok(eventsDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{EventId}/addControllers")]
        [Authorize(Roles = "organisator")]
        [EndpointName("Add controllers to the event")]
        [EndpointSummary("Assign multiple controllers to an event.")]
        [EndpointDescription("Assigns controllers to an event")]
        [SwaggerResponse(statusCode: 200, description: "Users retrieved successfully.")]
        [SwaggerResponse(statusCode: 204, description: "No events found.")]
        [SwaggerResponse(statusCode: 400, description: "Bad request.")]
        [SwaggerResponse(statusCode: 401, description: "Unauthorized.")]
        public async Task<ActionResult> AssignControllers([FromRoute] Guid EventId, [FromBody] List<Guid> ControllersId)
        {
            try
            {
                Guid? MyId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub")!);
                Guid MyUserId = MyId ?? Guid.Empty;
                bool myEvent = await _eventService.IsEventMine(EventId, MyUserId);
                if (!myEvent) return Forbid();

                bool assigned = await _eventService.AssignController(EventId, ControllersId);
                if(!assigned) return NoContent();
                return Ok();
            }
            catch (Exception ex) {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost("availablecontrollers")]
        [Authorize(Roles = "organisator")]
        [EndpointName("Get available controllers")]
        [EndpointSummary("Get all controllers that are free on a specific day")]
        [EndpointDescription("Returns all free controllers.")]
        [SwaggerResponse(statusCode: 200, type: typeof(IEnumerable<UserDto>), description: "Users retrieved successfully.")]
        [SwaggerResponse(statusCode: 204, description: "No events found.")]
        [SwaggerResponse(statusCode: 400, description: "Bad request.")]
        [SwaggerResponse(statusCode: 401, description: "Unauthorized.")]
        public async Task<ActionResult> AvailableControllers([FromBody] DateTime date)
        {
            try
            {
                IEnumerable<User> availableControllers = await _eventService.AvailableControllers(date);
                IEnumerable<UserDto> availableControllersDto = availableControllers!
                  .Where(x => x != null)
                  .Select(x => mapper.MapToUserDTO(x!))
                  .ToArray();
                if (availableControllersDto == null) return NoContent();
                return Ok(availableControllersDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet("{EventId}/controllers")]
        [Authorize(Roles = "organisator")]
        [EndpointName("GetControllersFromEvent")]
        [EndpointSummary("Get all controllers from an event")]
        [EndpointDescription("Returns all event's controllers.")]
        [SwaggerResponse(statusCode: 200, type: typeof(IEnumerable<UserDto>), description: "Users retrieved successfully.")]
        [SwaggerResponse(statusCode: 204, description: "No events found.")]
        [SwaggerResponse(statusCode: 400, description: "Bad request.")]
        [SwaggerResponse(statusCode: 401, description: "Unauthorized.")]
        public async Task<ActionResult> ControllersFromEvent([FromRoute] Guid EventId)
        {
            try
            {
                IEnumerable<User> controllers = await _eventService.ControllersFromEvent(EventId);
                IEnumerable<UserDto> controllersDto = controllers!
                          .Where(x => x != null)
                          .Select(x => mapper.MapToUserDTO(x!))
                          .ToArray();
                if (controllersDto == null) return NoContent();
                return Ok(controllersDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("statistics/compare")]
        [EndpointName("CompareEventStatistics")]
        [EndpointSummary("Compare statistics of multiple events")]
        [EndpointDescription("Returns statistics for multiple events for frontend chart comparison.")]
        [SwaggerResponse(
    statusCode: 200,
    type: typeof(IEnumerable<EventStatisticsComparisonDto>),
    description: "Statistics retrieved successfully."
)]
        [SwaggerResponse(statusCode: 400, description: "Bad request.")]
        public async Task<ActionResult<IEnumerable<EventStatisticsComparisonDto>>> CompareStatistics(
    [FromQuery] Guid[] eventIds)
        {
            try
            {
                if (eventIds == null || eventIds.Length == 0)
                {
                    return BadRequest("At least one EventId is required.");
                }

                List<EventStatisticsComparisonDto> result = new();

                foreach (Guid eventId in eventIds)
                {
                    Event? eventItem =
                        await _eventService.GetByIdAsync(eventId);

                    if (eventItem == null)
                    {
                        continue;
                    }

                    EventStatistics? statistics =
                        await _eventService.GetStatisticsAsync(eventId);

                    if (statistics == null)
                    {
                        continue;
                    }

                    result.Add(new EventStatisticsComparisonDto
                    {
                        EventId = eventItem.Id,
                        EventName = eventItem.EventName,
                        SoldTickets = statistics.SoldTickets,
                        RemainingTickets = statistics.RemainingTickets,
                        Revenue = statistics.Revenue,
                        UsedTickets = statistics.UsedTickets,
                        OccupancyPercentage = statistics.OccupancyPercentage
                    });
                }

                if (!result.Any())
                {
                    return NoContent();
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
