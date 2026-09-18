CREATE PROCEDURE [eventos].[Event_Create]
    @UserId         UNIQUEIDENTIFIER,
    @EventName      NVARCHAR(100),
    @StartTime      DATETIME2,
    @EndTime        DATETIME2        = NULL,
    @Capacity       INT              = NULL,
    @TicketCost     DECIMAL(7,2),
    @LocationName   NVARCHAR(30),
    @CategoryId     UNIQUEIDENTIFIER,
    @ImagePath      NVARCHAR(MAX)    = NULL,
    @Description    NVARCHAR(255)    = NULL
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO [eventos].[Event]
    (
        [UserId],
        [EventName],
        [StartTime],
        [EndTime],
        [Capacity],
        [TicketCost],
        [LocationName],
        [CategoryId],
        [ImagePath],
        [Description]
    )
    OUTPUT inserted.[Id] AS [NewEventId]
    VALUES
    (
        @UserId,
        @EventName,
        @StartTime,
        @EndTime,
        @Capacity,
        @TicketCost,
        @LocationName,
        @CategoryId,
        @ImagePath,
        @Description
    );
END;
GO
