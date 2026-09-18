CREATE PROCEDURE [eventos].[IsController]
    @Id UNIQUEIDENTIFIER
AS
BEGIN
SELECT        [eventos].[User].[Id]
FROM          [eventos].[Role] INNER JOIN
              [eventos].[User] ON [eventos].[Role].[Id] = [eventos].[User].[RoleId]
WHERE        ([eventos].[User].[Id] = @Id) AND ([eventos].[Role].[RoleName] = N'controller')
END;
