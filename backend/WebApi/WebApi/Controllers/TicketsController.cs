using Core.Models;
using Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using WebApi.DTO;
using WebApi.Mapper;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Tags("TicketController")]
    [ApiExplorerSettings(GroupName = "Ticket")]
    public class TicketsController(
        ITicketService ticketService,
        DtoMapperProfile mapper) : ControllerBase
    {
        [HttpGet("{id:guid}")]
        [Authorize(Roles = "controller")]
        [EndpointName("CheckTicket")]
        [EndpointSummary("Check ticket")]
        [EndpointDescription(
            "Checks whether the specified ticket has already been used.")]
        [SwaggerResponse(
            statusCode: 200,
            type: typeof(TicketDto),
            description: "Ticket status returned successfully.")]
        [SwaggerResponse(
            statusCode: 404,
            description: "Ticket not found.")]
        [SwaggerResponse(
            statusCode: 400,
            description: "Bad request.")]
        public async Task<ActionResult<TicketDto>> GetByIdAsync(
            [FromRoute] Guid id)
        {
            try
            {
                Ticket? ticket =
                    await ticketService.GetByIdAsync(id);

                if (ticket == null)
                {
                    return NotFound("Ticket not found.");
                }

                TicketDto ticketDto =
                    mapper.MapToTicketDto(ticket);

                return Ok(new { ticket.IsUsed, ticketDto.EventId });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost("{id:guid}/use")]
        [Authorize(Roles = "controller")]
        [EndpointName("UseTicket")]
        [EndpointSummary("Use ticket")]
        [EndpointDescription(
            "Checks whether the ticket can be used and marks it as used.")]
        [SwaggerResponse(
            statusCode: 200,
            type: typeof(TicketDto),
            description: "Ticket used successfully.")]
        [SwaggerResponse(
            statusCode: 404,
            description: "Ticket not found.")]
        [SwaggerResponse(
            statusCode: 400,
            description: "Ticket has already been used or could not be used.")]
        public async Task<ActionResult<TicketDto>> UseTicketAsync(
            [FromRoute] Guid id)
        {
            try
            {
                Ticket? ticket =
                    await ticketService.GetByIdAsync(id);

                if (ticket == null)
                {
                    return NotFound("Ticket not found.");
                }

                if (ticket.IsUsed)
                {
                    return BadRequest(
                        "Ticket has already been used.");
                }

                bool used =
                    await ticketService.UseTicketAsync(id);

                if (!used)
                {
                    return BadRequest(
                        "Ticket could not be used.");
                }

                ticket.IsUsed = true;

                TicketDto ticketDto =
                    mapper.MapToTicketDto(ticket);

                return Ok(ticketDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}