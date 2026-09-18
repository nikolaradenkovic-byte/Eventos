CREATE PROCEDURE [eventos].[GetByCategoryId]
    @CategoryId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        [Id],
        [UserId],
        [CategoryId],
        [ImagePath],
        [EventName],
        [Description],
        [LocationName],
        [Capacity],
        [TicketCost],
        [IsCanceled],
        [StartTime],
        [EndTime]
    FROM [eventos].[Event]
    WHERE [CategoryId] = @CategoryId;
END;