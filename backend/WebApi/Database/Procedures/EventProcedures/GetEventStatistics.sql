CREATE PROCEDURE [eventos].[GetEventStatistics]
    @EventId UNIQUEIDENTIFIER
AS
BEGIN
    SELECT  [Id], [OrderId], [EventId], [IsUsed]
    FROM    [eventos].[Ticket]
    WHERE   [EventId] = @EventId
END;
GO
