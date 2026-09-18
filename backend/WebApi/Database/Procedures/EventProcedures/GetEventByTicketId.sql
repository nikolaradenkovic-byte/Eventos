CREATE PROCEDURE [eventos].[GetEventByTicketId]
    @Id UNIQUEIDENTIFIER
AS
BEGIN
SELECT       [eventos].[Event].*
FROM         [eventos].[Event]      INNER JOIN
             [eventos].[Ticket]     ON [eventos].[Event].[Id] = [eventos].[Ticket].[EventId]
WHERE        [eventos].[Ticket].[Id] = @Id;
END;
GO