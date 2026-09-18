namespace Core.Models
{
    public class EventStatistics
    {
        public int SoldTickets { get; set; }

        public int RemainingTickets { get; set; }

        public decimal Revenue { get; set; }

        public int UsedTickets { get; set; }

        public decimal OccupancyPercentage { get; set; }
    }
}