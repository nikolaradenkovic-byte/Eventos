using Core.Models;
using Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Security.Claims;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Tags("OrderController")]
    [EnableCors("_eventosCors")]
    [ApiExplorerSettings(GroupName = "Order")]
    public class OrdersController(IOrderService orderService) : ControllerBase
    {
        [HttpPost("create")]
        [Authorize(Roles = "user")]
        [EndpointName("CreateOrder")]
        [EndpointSummary("Create Order")]
        [EndpointDescription("Returns order.")]
        [SwaggerResponse(statusCode: 200, type: typeof(Order), description: "Success")]
        [SwaggerResponse(statusCode: 401, description: "Unauthorized")]
        [SwaggerResponse(statusCode: 400, description: "Bad request")]
        public async Task<ActionResult<Order?>> CreateOrder([FromBody] List<RequestModel> requestTickets)
        {
            try {
                Guid? id = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub")!);
                string firstName = User.FindFirstValue("FirstName")!;
                string lastName = User.FindFirstValue("LastName")!;
                string email = User.FindFirstValue(ClaimTypes.Email) ?? User.FindFirstValue("email")!;
                if (id == null || firstName == null || lastName == null || email == null) return BadRequest();
                Guid UserId = id ?? Guid.Empty;
                if(UserId == Guid.Empty) return BadRequest();

                Order? order = await orderService.CreateOrder(UserId, requestTickets, email, firstName, lastName);

                if (order == null) return BadRequest();

                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPost("noauth")]
        [EndpointName("CreateOrderWithoutAuthorization")]
        [EndpointSummary("Create Order without Authorization")]
        [EndpointDescription("Returns order.")]
        [SwaggerResponse(statusCode: 200, type: typeof(Order), description: "Success")]
        [SwaggerResponse(statusCode: 401, description: "Unauthorized")]
        [SwaggerResponse(statusCode: 400, description: "Bad request")]
        public async Task<ActionResult<Order?>> CreateOrderNoAuth([FromBody] RequestTickets requestTickets)
        {
            try
            {
                Order? order = await orderService.CreateOrderNoAuth(requestTickets);

                if (order == null) return BadRequest();

                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
    }
}

