CREATE PROCEDURE [eventos].[GetUserRole]
        @Id UNIQUEIDENTIFIER
AS
BEGIN
SELECT  [RoleId]
FROM    [eventos].[User]
WHERE   [Id] = @Id
END;