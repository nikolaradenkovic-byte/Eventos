CREATE PROCEDURE [eventos].[GetUserById]
        @Id UNIQUEIDENTIFIER
AS
BEGIN
SELECT  *
FROM    [eventos].[User]
WHERE   [Id] = @Id
END;