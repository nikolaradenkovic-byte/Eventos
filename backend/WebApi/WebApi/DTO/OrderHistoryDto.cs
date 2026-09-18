namespace WebApi.DTO
{
    public class OrderHistoryDto
    {
        public Guid Id { get; set; }

        public DateTime CreatedAt { get; set; }

        public IEnumerable<MyTicketDto> Tickets { get; set; }
            = Enumerable.Empty<MyTicketDto>();
    }
}