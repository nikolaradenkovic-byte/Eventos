CREATE PROCEDURE [eventos].[CreateUser]
    @Email NVARCHAR(100),
    @Password NVARCHAR(100),
    @FirstName NVARCHAR(100),
    @LastName NVARCHAR(100),
    @RoleName NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    Declare @RoleId UNIQUEIDENTIFIER;
    SELECT @RoleId = Id FROM [eventos].[Role] WHERE [RoleName] = @RoleName;

    IF @RoleId IS NOT NULL
    BEGIN

        INSERT INTO [eventos].[User]    ([Email],   [Password],     [FirstName],    [LastName], [RoleId])
        VALUES                          (@Email,    @Password,      @FirstName,     @LastName,   @RoleId);
    END
    ELSE
    BEGIN;
        THROW 51000, 'The specified role name does not exist.', 1;
    END
END;
