CREATE PROCEDURE [eventos].[Event_GetById]
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SELECT
        [Id],
        [UserId],
        [CategoryId],
        [EventName],
        [Description],
        [LocationName],
        [Capacity],
        [TicketCost],
        [IsCanceled],
        [StartTime],
        [EndTime]
    FROM  [eventos].[Event]
    WHERE [Id] = @Id AND IsActive = 1;
END;
GO