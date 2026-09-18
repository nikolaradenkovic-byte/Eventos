CREATE PROCEDURE [eventos].[UpdateUser]
        @Id        UNIQUEIDENTIFIER,
        @Email     NVARCHAR(100),
        @FirstName NVARCHAR(100),
        @LastName  NVARCHAR(100)
AS
BEGIN
UPDATE  [eventos].[User]
SET     [Email] = @Email,
        [FirstName] = @FirstName, 
        [LastName] = @LastName
WHERE   [Id] = @Id
END;