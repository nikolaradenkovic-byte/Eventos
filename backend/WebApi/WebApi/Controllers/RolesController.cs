using Core.Models;
using Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Service.Services;
using Swashbuckle.AspNetCore.Annotations;
using System.Data;
using System.Security.Claims;
using WebApi.DTO;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Tags("RoleController")]
    [ApiExplorerSettings(GroupName = "Role")]
    public class RolesController(IRoleService roleService) : Controller
    {

        [HttpGet()]
        [Authorize(Roles = "admin")]
        [EndpointName("GetAllRoles")]
        [EndpointSummary("Gets all roles")]
        [EndpointDescription("Returns all roles.")]
        [SwaggerResponse(statusCode: 200, type: typeof(IEnumerable<Role>), description: "Roles retrieved successfully.")]
        [SwaggerResponse(statusCode: 204, description: "No roles found.")]
        [SwaggerResponse(statusCode: 400, description: "Bad request.")]
        [SwaggerResponse(statusCode: 401, description: "Unauthorized.")]
        public async Task<ActionResult<IEnumerable<Role>>> GetAllRoles()
        {
            try
            {
                IEnumerable<Role?>? roles = await roleService.GetAllRoles();

                if (roles == null || !(roles.Any()))
                {
                    return NoContent();
                }

                return Ok(roles);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }


        [HttpPut("{Id}")]
        [Authorize(Roles = "admin")]
        [EndpointName("Change user Role")]
        [EndpointSummary("Changes role")]
        [EndpointDescription("Changes the role of user.")]
        [SwaggerResponse(statusCode: 200, type: typeof(IEnumerable<Role>), description: "Role changed successfully.")]
        [SwaggerResponse(statusCode: 204, description: "No roles found.")]
        [SwaggerResponse(statusCode: 400, description: "Bad request.")]
        [SwaggerResponse(statusCode: 401, description: "Unauthorized.")]
        public async Task<ActionResult> ChangeUserRole([FromRoute] Guid Id, [FromBody] Guid RoleId)
        {
            try
            {
                bool roleChanged = await roleService.ChangeUserRole(Id, RoleId);

                if (!roleChanged) return NoContent();

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("create")]
        [Authorize(Roles = "admin")]
        [EndpointName("Create role")]
        [EndpointSummary("Create role")]
        [EndpointDescription("Creates a new role.")]
        [SwaggerResponse(statusCode: 200, type: typeof(IEnumerable<Role>), description: "Role created successfully.")]
        [SwaggerResponse(statusCode: 204, description: "No roles found.")]
        [SwaggerResponse(statusCode: 400, description: "Bad request.")]
        [SwaggerResponse(statusCode: 401, description: "Unauthorized.")]
        public async Task<ActionResult> CreateRole([FromBody] string RoleName)
        {
            try
            {
                bool roleChanged = await roleService.CreateRole(RoleName);

                if (!roleChanged) return NoContent();

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
