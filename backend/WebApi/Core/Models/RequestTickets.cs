using System.ComponentModel.DataAnnotations;

namespace Core.Models
{
    public class RequestTickets
    {
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public required string email { get; set; }
        public required string firstName { get; set; }
        public required string lastName { get; set; }
        public required List<RequestModel> events { get; set; }
    }
}
