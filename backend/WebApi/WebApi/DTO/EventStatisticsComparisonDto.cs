namespace WebApi.DTO
{
    public class EventStatisticsComparisonDto
    {
        public Guid EventId { get; set; }

        public string EventName { get; set; } = string.Empty;

        public int SoldTickets { get; set; }

        public int RemainingTickets { get; set; }

        public decimal Revenue { get; set; }

        public int UsedTickets { get; set; }

        public decimal OccupancyPercentage { get; set; }
    }
}