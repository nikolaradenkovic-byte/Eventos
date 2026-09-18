using System.ComponentModel.DataAnnotations;

namespace WebApi.DTO
{
    public class CreateEventDto
    {
        public Guid UserId { get; set; }

        public Guid CategoryId { get; set; }

        public string? ImagePath { get; set; }

        public string EventName { get; set; } = string.Empty;

        public string? Description { get; set; }

        public string LocationName { get; set; } = string.Empty;

        public int? Capacity { get; set; }

        public decimal TicketCost { get; set; }

        public bool IsCanceled { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime? EndTime { get; set; }

        public required IEnumerable<Guid> ControllerIds { get; set; }

        public IFormFile? ImageFile { get; set; }
    }
}