CREATE PROCEDURE [eventos].[OrderMap_Create]
    @UserId UNIQUEIDENTIFIER,
    @OrderId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
            INSERT INTO [eventos].[OrderMap] ([UserId],      [OrderId])
            VALUES                           (@UserId,        @OrderId);
END;
GO
