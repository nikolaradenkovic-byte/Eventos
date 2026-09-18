using System.ComponentModel.DataAnnotations;

namespace Core.Models
{
    public class Credentials
    {
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public required string Email { get; set; }
        
        [MinLength(4, ErrorMessage = "Username must be at least 5 characters long.")]
        public required string Password { get; set; }
    }
}
