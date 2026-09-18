using System.ComponentModel.DataAnnotations;

namespace WebApi.DTO
{
    public class RegisterUserDto
    {
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public required string Email { get; set; }

        [MinLength(4, ErrorMessage = "Username must be at least 5 characters long.")]
        public required string Password { get; set; }

        public string? FirstName { get; set; }

        public string? LastName { get; set; }
    }
}
