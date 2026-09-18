namespace Core.Models
{
    public class RoleMap
    {
        public Guid Id { get; set; }
        public required Guid UserId { get; set; }
        public required Guid RoleId { get; set; }
    }
}
