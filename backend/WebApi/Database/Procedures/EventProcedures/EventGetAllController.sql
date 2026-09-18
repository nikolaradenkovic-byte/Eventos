CREATE PROCEDURE [eventos].[Event_GetAllControllers]
    @Id UNIQUEIDENTIFIER
AS
BEGIN

SELECT          eventos.Event.Id, eventos.Event.UserId, eventos.Event.CategoryId, eventos.Event.EventName, eventos.Event.Description, eventos.Event.LocationName, eventos.Event.Capacity, eventos.Event.TicketCost, 
                         eventos.Event.IsCanceled, eventos.Event.StartTime, eventos.Event.EndTime
FROM            [eventos].[ControllerMap]               INNER JOIN
                [eventos].[Event]                       ON [eventos].[ControllerMap].[EventId] = [eventos].[Event].[Id]
WHERE           [eventos].[ControllerMap].[UserId] =    @Id AND eventos.Event.IsActive = 1
END;
GO

