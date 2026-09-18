CREATE PROCEDURE [eventos].[GetEventImage]
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SELECT [ImagePath]
    FROM   [eventos].[Event]
    WHERE  [Id] = @Id;
END;
GO