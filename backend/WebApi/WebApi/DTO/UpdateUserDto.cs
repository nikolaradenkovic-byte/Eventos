using System.ComponentModel.DataAnnotations;

namespace WebApi.DTO
{
    public class UpdateUserDto
    {
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public required string Email { get; set; }

        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public Guid? RoleId { get; set; }
    }
}
