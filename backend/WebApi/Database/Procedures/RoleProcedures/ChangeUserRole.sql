CREATE PROCEDURE [eventos].[ChangeUserRole]
	@Id UNIQUEIDENTIFIER,
	@RoleId UNIQUEIDENTIFIER
AS
BEGIN
UPDATE       eventos.[User]
SET                RoleId = @RoleId
WHERE        (Id = @Id)
END;
