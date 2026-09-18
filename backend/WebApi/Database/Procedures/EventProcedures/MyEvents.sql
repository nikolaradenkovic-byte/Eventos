CREATE PROCEDURE [eventos].[MyEvents]
    @UserId UNIQUEIDENTIFIER
AS
BEGIN
SELECT  Id, UserId, CategoryId, EventName, Description, LocationName, Capacity, TicketCost, IsCanceled, StartTime, EndTime, IsActive
FROM    [eventos].[Event]
WHERE   ([UserId] = @UserId AND IsActive = 1)
END;
