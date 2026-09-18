CREATE PROCEDURE [eventos].[IsEventMine]
    @Id UNIQUEIDENTIFIER
AS
BEGIN
SELECT        UserId
FROM            eventos.Event
WHERE        (Id = @Id)
END;
GO