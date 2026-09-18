namespace WebApi.DTO
{
    public class TicketDto
    {
        public required Guid OrderId { get; set; }
        public required Guid EventId { get; set; }
        public bool IsUsed { get; set; }
    }
}