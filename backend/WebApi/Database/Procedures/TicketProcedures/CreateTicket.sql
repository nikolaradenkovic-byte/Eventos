CREATE PROCEDURE [eventos].[Ticket_Create]
    @EventId UNIQUEIDENTIFIER,
    @OrderId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
            INSERT INTO [eventos].[Ticket] ([EventId],      [OrderId])
            VALUES                         (@EventId,        @OrderId);
END;
GO
