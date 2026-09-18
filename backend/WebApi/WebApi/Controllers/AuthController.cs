using Core.Models;
using Core.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using Swashbuckle.AspNetCore.Annotations;
using System.Security.Claims;
using WebApi.DTO;
using WebApi.Mapper;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Tags("AuthController")]
    [EnableCors("_eventosCors")]
    [ApiExplorerSettings(GroupName = "Auth")]
    public class AuthController(IAuthService authService, DtoMapperProfile mapper) : ControllerBase
    {
        [HttpPost("register")]
        [EndpointName("CreateUser")]
        [EndpointSummary("Create user")]
        [EndpointDescription("Creates a new user.")]
        [SwaggerResponse(statusCode: 200, description: "User created successfully.")]
        [SwaggerResponse(statusCode: 204, description: "User could not be created.")]
        [SwaggerResponse(statusCode: 400, description: "Bad request.")]
        public async Task<ActionResult> CreateUser([FromBody] RegisterUserDto userDto)
        {
            try
            {
                User user = mapper.RegMapToUser(userDto);
                int rowsAffected = await authService.CreateUser(user);

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

        [HttpPost("login")]
        [EndpointName("Login")]
        [EndpointSummary("Login")]
        [EndpointDescription("Authenticates a user and returns the authentication response.")]
        [SwaggerResponse(statusCode: 200, type: typeof(Response), description: "Login successful.")]
        [SwaggerResponse(statusCode: 401, description: "Unauthorized.")]
        [SwaggerResponse(statusCode: 400, description: "Bad request.")]
        public async Task<ActionResult<Response?>> Login([FromBody] Credentials credentials)
        {
            try
            {
                Response? response = await authService.Login(credentials);
                if (response == null) Unauthorized();
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("refresh-token")]
        [EndpointName("RefreshToken")]
        [EndpointSummary("Refresh token")]
        [EndpointDescription("Refreshes the authentication token using an existing token.")]
        [SwaggerResponse(statusCode: 200, type: typeof(Response), description: "Token refreshed successfully.")]
        [SwaggerResponse(statusCode: 400, description: "Bad request.")]
        public async Task<Response?> RefreshToken([FromBody] Response oldToken)
        {
            return await authService.RefreshToken(oldToken);
        }

        [HttpPost("logout")]
        [EndpointName("Logout")]
        [EndpointSummary("Logout")]
        [EndpointDescription("Logs out the user.")]
        [SwaggerResponse(statusCode: 200, description: "Logout successful.")]
        [SwaggerResponse(statusCode: 401, description: "Unauthorized.")]
        [SwaggerResponse(statusCode: 400, description: "Bad request.")]
        public async Task<ActionResult<bool>> Logout([FromBody] Response token)
        {
            try {
                bool isLoggedOut = await authService.Logout(token);

                if (!isLoggedOut) return BadRequest("You are already logged out");
                return Ok("Successfully logged out");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("me")]
        [Authorize]
        [EndpointName("Me")]
        [EndpointSummary("Me")]
        [EndpointDescription("Gets information back from access token.")]
        [SwaggerResponse(statusCode: 200, description: "Successful.")]
        [SwaggerResponse(statusCode: 401, description: "Unauthorized.")]
        [SwaggerResponse(statusCode: 400, description: "Bad request.")]
        public async Task<ActionResult> Me()
        {
            try
            {
                var id = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
                var firstName = User.FindFirstValue("FirstName");
                var lastName = User.FindFirstValue("LastName");
                var email = User.FindFirstValue(ClaimTypes.Email) ?? User.FindFirstValue("email");

                string role = User.FindFirstValue(ClaimTypes.Role)!;

                Guid roleId = await authService.GetRoleId(role);

                return Ok(new {id, firstName, lastName, email, roleId});
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
