CREATE PROCEDURE [eventos].[DeleteUserById]
    @Id UNIQUEIDENTIFIER
AS
BEGIN
    DELETE FROM [eventos].[User]
    WHERE       [Id] = @Id;
END;