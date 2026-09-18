CREATE PROCEDURE [eventos].[Ticket_GetByUserId]
    @UserId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT DISTINCT
        T.[Id] AS TicketId,
        T.[OrderId],
        T.[EventId],
        E.[EventName],
        E.[StartTime],
        E.[LocationName],
        T.[IsUsed]
    FROM [eventos].[Ticket] T
    INNER JOIN [eventos].[OrderMap] OM
        ON OM.[OrderId] = T.[OrderId]
    INNER JOIN [eventos].[Event] E
        ON E.[Id] = T.[EventId]
    WHERE OM.[UserId] = @UserId
    ORDER BY E.[StartTime] DESC;
END;
GO