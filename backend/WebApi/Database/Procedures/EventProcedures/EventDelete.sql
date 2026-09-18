CREATE PROCEDURE [eventos].[Event_Delete]
    @Id UNIQUEIDENTIFIER
AS
BEGIN
UPDATE       eventos.Event
SET          IsActive = 0
WHERE        (Id = @Id)
END;
