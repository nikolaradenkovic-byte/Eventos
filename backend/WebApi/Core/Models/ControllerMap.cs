namespace Core.Models
{
    public class ControllerMap
    {
        public Guid Id { get; set; }
        public required Guid UserId { get; set; }
        public required Guid EventId { get; set; }
    }
}
