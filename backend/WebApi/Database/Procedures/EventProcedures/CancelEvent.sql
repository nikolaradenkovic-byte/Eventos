CREATE PROCEDURE [eventos].[CancelEvent]
    @Id UNIQUEIDENTIFIER
AS
BEGIN
UPDATE       eventos.Event
SET                IsCanceled = 1
WHERE        (Id = @Id)
END;
