CREATE PROCEDURE [eventos].[GetAllTicketsByOrderId]
        @OrderId UNIQUEIDENTIFIER
AS
BEGIN
SELECT *
FROM    [eventos].[Ticket]
WHERE   [OrderId] = @OrderId
END;