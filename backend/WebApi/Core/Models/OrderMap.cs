namespace Core.Models
{
    public class OrderMap
    {
        public Guid Id { get; set; }
        required public Guid UserId { get; set; }
        required public Guid OrderId { get; set; }
    }
}
