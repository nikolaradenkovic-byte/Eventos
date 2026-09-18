CREATE PROCEDURE [eventos].[Event_Update]
    @Id             UNIQUEIDENTIFIER,
    @EventName      NVARCHAR(100),
    @StartTime      DATETIME2,
    @ImagePath      NVARCHAR(MAX)       NULL,
    @EndTime        DATETIME2           NULL,
    @Capacity       INT                 NULL,
    @TicketCost     DECIMAL(7,2),
    @LocationName   NVARCHAR(30),
    @CategoryId     UNIQUEIDENTIFIER,
    @Description    NVARCHAR(255)       NULL,
    @IsCanceled     BIT
AS
BEGIN
    UPDATE [eventos].[Event]
    SET
        [EventName]    = @EventName,
        [StartTime]    = @StartTime,
        [EndTime]      = @EndTime,
        [ImagePath]    = @ImagePath,
        [Capacity]     = @Capacity,
        [TicketCost]   = @TicketCost,
        [LocationName] = @LocationName,
        [CategoryId]   = @CategoryId,
        [Description]  = @Description,
        [IsCanceled]   = @IsCanceled
    WHERE [Id] = @Id;
END;
GO
  