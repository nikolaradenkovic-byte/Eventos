using System.ComponentModel.DataAnnotations;

namespace Core.Models
{
    public class User
    {
        public Guid Id { get; set; }

        public Guid RoleId { get; set; }

        [EmailAddress(ErrorMessage = "Invalid email format")]
        public required string Email { get; set; }

        [MinLength(4, ErrorMessage = "Username must be at least 5 characters long.")]
        public string? Password { get; set; }

        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public DateTime CreatedAt { get; set; }

    }
}
