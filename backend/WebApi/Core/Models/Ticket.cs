namespace Core.Models
{
    public class Ticket
    {
        public Guid Id { get; set; }
        public required Guid OrderId { get; set; }
        public required Guid EventId { get; set; }
        public bool IsUsed { get; set; }
    }
}
