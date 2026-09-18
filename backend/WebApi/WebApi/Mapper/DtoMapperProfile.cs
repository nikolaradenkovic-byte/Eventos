using Core.Models;
using Riok.Mapperly.Abstractions;
using WebApi.DTO;

namespace WebApi.Mapper;

[Mapper]
public partial class DtoMapperProfile
{
    [MapperIgnoreSource(nameof(User.CreatedAt))]
    [MapperIgnoreSource(nameof(User.Password))]
    public partial UserDto MapToUserDTO(User user);
    
    [MapperIgnoreTarget(nameof(User.CreatedAt))]
    [MapperIgnoreTarget(nameof(User.Password))]
    public partial User MapToUser(UserDto userDto);



    [MapperIgnoreSource(nameof(User.CreatedAt))]
    [MapperIgnoreSource(nameof(User.Password))]
    [MapperIgnoreSource(nameof(User.Id))]
    public partial UpdateUserDto UpdateMapToUserDTO(User user);

    [MapperIgnoreTarget(nameof(User.CreatedAt))]
    [MapperIgnoreTarget(nameof(User.Password))]
    [MapperIgnoreTarget(nameof(User.Id))]
    public partial User UpdateMapToUser(UpdateUserDto userDto);



    [MapperIgnoreSource(nameof(User.RoleId))]
    [MapperIgnoreSource(nameof(User.CreatedAt))]
    [MapperIgnoreSource(nameof(User.Id))]
    public partial RegisterUserDto MapToRegUser(User user);

    [MapperIgnoreTarget(nameof(User.RoleId))]
    [MapperIgnoreTarget(nameof(User.CreatedAt))]
    [MapperIgnoreTarget(nameof(User.Id))]
    public partial User RegMapToUser(RegisterUserDto user);



    [MapperIgnoreSource(nameof(Event.Id))]
    public partial EventDto MapToEventDto(Event _event);
    
    [MapperIgnoreTarget(nameof(Event.Id))]
    public partial Event MapToEvent(EventDto eventDto);





    [MapperIgnoreSource(nameof(Event.ImagePath))]
    public partial EventWithoutImageDto MapToEventDtoI(Event _event);

    [MapperIgnoreTarget(nameof(Event.ImagePath))]
    public partial Event MapToEventI(EventWithoutImageDto eventDto);






    [MapperIgnoreTarget(nameof(Event.Id))]
    [MapperIgnoreSource(nameof(CreateEventDto.ControllerIds))]
    [MapperIgnoreSource(nameof(CreateEventDto.ImageFile))]
    public partial Event CreateMapToEvent(CreateEventDto eventDto);


    [MapperIgnoreSource(nameof(Category.Id))]
    public partial CategoryDto MapToCategoryDto(Category category);
    
    [MapperIgnoreTarget(nameof(Category.Id))]
    public partial Category MapToCategory(CategoryDto categoryDto);



    [MapperIgnoreSource(nameof(Ticket.Id))]
    public partial TicketDto MapToTicketDto(Ticket ticket);

    [MapperIgnoreTarget(nameof(Ticket.Id))]
    public partial Ticket MapToTicket(TicketDto ticketDto);
    public partial OrderHistoryDto MapToOrderHistoryDto(Order order);

    public partial MyTicketDto MapToMyTicketDto(UserTicket ticket);


}
