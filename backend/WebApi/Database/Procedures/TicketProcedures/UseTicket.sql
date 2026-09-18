CREATE PROCEDURE [eventos].[Ticket_Use]
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT OFF;

    UPDATE  [eventos].[Ticket]
    SET     [IsUsed] = 1
    WHERE   [Id] = @Id
    AND     [IsUsed] = 0;
END;