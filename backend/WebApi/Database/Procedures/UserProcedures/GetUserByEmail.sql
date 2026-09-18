CREATE PROCEDURE [eventos].[GetUserByEmail]
            @Email NVARCHAR(100)
AS
BEGIN
    SELECT  *
    FROM    [eventos].[User]
    WHERE   [Email] = @Email;
END;