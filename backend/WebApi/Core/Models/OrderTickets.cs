namespace Core.Models
{
    public class OrderTickets
    {
        public required Order Order { get; set; }
        public required IEnumerable<Ticket> Tickets { get; set; }
    }
}
