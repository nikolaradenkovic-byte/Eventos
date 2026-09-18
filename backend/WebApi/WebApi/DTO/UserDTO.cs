using System.ComponentModel.DataAnnotations;

namespace WebApi.DTO
{
    public class UserDto
    {
        public required Guid Id { get; set; }

        [EmailAddress(ErrorMessage = "Invalid email format")]
        public required string Email { get; set; }

        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public Guid? RoleId { get; set; }
    }
}
