CREATE PROCEDURE [eventos].[GetEventsByCategory]
    @CategoryId UNIQUEIDENTIFIER
AS
BEGIN
SELECT         Id, UserId, CategoryId, EventName, Description, LocationName, Capacity, TicketCost, IsCanceled, StartTime, EndTime
FROM            eventos.Event
WHERE        (CategoryId = @CategoryId) AND IsActive = 1
END;
