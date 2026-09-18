CREATE PROCEDURE [eventos].[GetEventControllers]
    @Id UNIQUEIDENTIFIER
AS
BEGIN
SELECT        eventos.[User].Id, eventos.[User].RoleId, eventos.[User].Email, eventos.[User].Password, eventos.[User].FirstName, eventos.[User].LastName, eventos.[User].CreatedAt
FROM            eventos.ControllerMap INNER JOIN
                         eventos.Event ON eventos.ControllerMap.EventId = eventos.Event.Id INNER JOIN
                         eventos.[User] ON eventos.ControllerMap.UserId = eventos.[User].Id
WHERE        (eventos.Event.Id = @Id)
END;
