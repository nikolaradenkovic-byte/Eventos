using Core.Models;
using Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Security.Claims;
using WebApi.DTO;
using WebApi.Mapper;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Tags("UserController")]
    [EnableCors("_eventosCors")]
    [ApiExplorerSettings(GroupName = "User")]
    public class UsersController(
        IUserService _userService,
        DtoMapperProfile mapper) : ControllerBase
    {
        [HttpGet("{Id}")]
        [Authorize(Roles = "admin")]
        [EndpointName("GetUser")]
        [EndpointSummary("Get user")]
        [EndpointDescription("Returns user information for the specified user ID.")]
        [SwaggerResponse(statusCode: 200, type: typeof(UserDto), description: "Success")]
        [SwaggerResponse(statusCode: 204, description: "User not found" )]
        [SwaggerResponse(statusCode: 401, description: "Unauthorized")]
        [SwaggerResponse(statusCode: 500, description: "Internal Server Error")]
        public async Task<ActionResult<UserDto?>> GetUser([FromRoute] Guid Id)
        {
            try
            {
                User? user = await _userService.GetUser(Id)!;
                UserDto? userDto = mapper.MapToUserDTO(user!);
                if (userDto == null) {
                    return NoContent();
                }

                userDto = mapper.MapToUserDTO(user);

                return Ok(userDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPut("{Id}")]
        [Authorize(Roles = "user")]
        [EndpointName("UpdateUser")]
        [EndpointSummary("Update user")]
        [EndpointDescription("Updates the specified user's information.")]
        [SwaggerResponse(statusCode: 200, description: "User updated successfully.")]
        [SwaggerResponse(statusCode: 204, description: "User was not updated.")]
        [SwaggerResponse(statusCode: 400, description: "Bad request.")]
        [SwaggerResponse(statusCode: 401, description: "Unauthorized.")]
        public async Task<ActionResult> UpdateUser([FromRoute] Guid Id, [FromBody] UpdateUserDto userDto)
        {
            try {
                Guid? MyId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub")!);
                if (Id != MyId) return Forbid();

                User user = mapper.UpdateMapToUser(userDto);
                user.Id = Id;

                int rowsAffected =
                    await _userService.UpdateUser(user);

                if (rowsAffected == 0)
                {
                    return NoContent();
                }

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{Id}")]
        [Authorize(Roles = "admin")]
        [EndpointName("DeleteUser")]
        [EndpointSummary("Delete user")]
        [EndpointDescription("Deletes the specified user by ID.")]
        [SwaggerResponse(statusCode: 200, description: "User deleted successfully.")]
        [SwaggerResponse(statusCode: 204, description: "User was not found.")]
        [SwaggerResponse(statusCode: 400, description: "Bad request.")]
        [SwaggerResponse(statusCode: 401, description: "Unauthorized.")]
        public async Task<ActionResult> DeleteUser(
            [FromRoute] Guid Id)
        {
            try
            {
                int rowsAffected =
                    await _userService.DeleteUser(Id);

                if (rowsAffected == 0)
                {
                    return NoContent();
                }

                return Ok(rowsAffected);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        [EndpointName("GetAllUsers")]
        [EndpointSummary("Get all users")]
        [EndpointDescription("Returns a list of all users.")]
        [SwaggerResponse(statusCode: 200, type: typeof(IEnumerable<UserDto>), description: "Users retrieved successfully.")]
        [SwaggerResponse(statusCode: 204, description: "No users found.")]
        [SwaggerResponse(statusCode: 400, description: "Bad request.")]
        [SwaggerResponse(statusCode: 401, description: "Unauthorized.")]
        [SwaggerResponse(statusCode: 403, description: "Forbidden.")]
        public async Task<ActionResult<IEnumerable<UserDto?>?>> GetAllUsers()
        {
            try
            {
                IEnumerable<User?>? users = await _userService.GetAllUsers()!;
                IEnumerable<UserDto?>? usersDto = users!
                          .Where(x => x != null)
                          .Select(x => mapper.MapToUserDTO(x!))
                          .ToArray();

                if (!usersDto.Any())
                {
                    return NoContent();
                }

                return Ok(usersDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("my-purchases")]
        [Authorize(Roles = "user")]
        [EndpointName("GetMyPurchases")]
        [EndpointSummary("Get my purchases")]
        [EndpointDescription("Returns the logged-in user's order history with purchased tickets.")]
        [SwaggerResponse(
    statusCode: 200,
    type: typeof(IEnumerable<OrderHistoryDto>),
    description: "Purchases retrieved successfully."
)]
        [SwaggerResponse(statusCode: 204, description: "User has no purchases.")]
        [SwaggerResponse(statusCode: 400, description: "Bad request.")]
        [SwaggerResponse(statusCode: 401, description: "Unauthorized.")]
        public async Task<ActionResult<IEnumerable<OrderHistoryDto>>> GetMyPurchases()
        {
            try
            {
                string? userIdClaim =
                    User.FindFirstValue(ClaimTypes.NameIdentifier)
                    ?? User.FindFirstValue("sub");

                if (!Guid.TryParse(userIdClaim, out Guid userId))
                {
                    return BadRequest("User id is missing.");
                }

                IEnumerable<Order> orders =
                    await _userService.GetOrdersByUserIdAsync(userId);

                IEnumerable<UserTicket> tickets =
                    await _userService.GetTicketsByUserIdAsync(userId);

                IEnumerable<OrderHistoryDto> purchases =
                    orders
                        .Select(order => new OrderHistoryDto
                        {
                            Id = order.Id,
                            CreatedAt = order.CreatedAt,

                            Tickets = tickets
                                .Where(ticket => ticket.OrderId == order.Id)
                                .Select(ticket => new MyTicketDto
                                {
                                    TicketId = ticket.TicketId,
                                    EventId = ticket.EventId,
                                    EventName = ticket.EventName,
                                    StartTime = ticket.StartTime,
                                    LocationName = ticket.LocationName,
                                    IsUsed = ticket.IsUsed
                                })
                                .ToArray()
                        })
                        .ToArray();

                if (!purchases.Any())
                {
                    return NoContent();
                }

                return Ok(purchases);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}