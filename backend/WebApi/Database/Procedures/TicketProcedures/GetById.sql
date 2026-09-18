CREATE PROCEDURE [eventos].[Ticket_GetById]
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        [Id],
        [OrderId],
        [EventId],
        [IsUsed]
    FROM [eventos].[Ticket]
    WHERE [Id] = @Id;
END;