CREATE PROCEDURE [eventos].[GetRoleName]
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    SELECT      [RoleName] FROM [eventos].[Role]
    WHERE       [Id] = @Id;
END;