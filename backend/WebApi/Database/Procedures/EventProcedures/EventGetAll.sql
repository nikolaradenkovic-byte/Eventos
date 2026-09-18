CREATE PROCEDURE [eventos].[Event_GetAll]
AS
BEGIN
    SELECT Id, UserId, CategoryId, EventName, Description, LocationName, Capacity, TicketCost, IsCanceled, StartTime, EndTime
    FROM [eventos].[Event]
    WHERE IsActive = 1
END;
GO