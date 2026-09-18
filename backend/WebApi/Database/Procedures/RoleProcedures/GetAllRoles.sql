CREATE PROCEDURE [eventos].[GetAllRoles]
AS
BEGIN
    SELECT [Id], [RoleName]
    FROM   [eventos].[Role]
END;
