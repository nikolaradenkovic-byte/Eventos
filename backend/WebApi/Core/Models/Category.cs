namespace Core.Models
{
    public class Category
    {
        public Guid Id { get; set; }

        public required string CategoryName { get; set; }
    }
}
