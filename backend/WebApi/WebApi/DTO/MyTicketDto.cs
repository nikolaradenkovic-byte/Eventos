namespace WebApi.DTO
{
    public class MyTicketDto
    {
        public Guid TicketId { get; set; }

        public Guid EventId { get; set; }

        public string EventName { get; set; } = string.Empty;

        public DateTime StartTime { get; set; }

        public string LocationName { get; set; } = string.Empty;

        public bool IsUsed { get; set; }
    }
}