CREATE PROCEDURE [eventos].[AvailableControllers]
    @Date DATETIME2
AS
BEGIN
SELECT   DISTINCT     eventos.[User].*
FROM            eventos.Role INNER JOIN
                         eventos.[User] ON eventos.Role.Id = eventos.[User].RoleId
WHERE        (eventos.Role.RoleName = N'controller') AND 

(eventos.[User].Id NOT IN (SELECT UserId
FROM            eventos.ControllerMap)

OR eventos.[User].Id NOT IN (SELECT eventos.ControllerMap.UserId
FROM            eventos.ControllerMap INNER JOIN
                         eventos.Event ON eventos.ControllerMap.EventId = eventos.Event.Id
WHERE        (CAST(eventos.Event.StartTime AS DATE) = CAST(@Date AS DATE))))
END;