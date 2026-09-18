CREATE PROCEDURE [eventos].[GetRoleId]
    @RoleName NVARCHAR(100)
AS
BEGIN
    SELECT      [Id] FROM [eventos].[Role]
    WHERE       [RoleName] = @RoleName;
END;