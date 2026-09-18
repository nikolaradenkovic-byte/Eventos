CREATE PROCEDURE [eventos].[AssignController]
    @UserId     UNIQUEIDENTIFIER,
    @EventId    UNIQUEIDENTIFIER
AS
BEGIN
INSERT INTO eventos.ControllerMap
                         (UserId, EventId)
VALUES        (@UserId, @EventId)
END;