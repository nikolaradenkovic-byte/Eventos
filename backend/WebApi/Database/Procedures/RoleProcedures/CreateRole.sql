CREATE PROCEDURE [eventos].[CreateRole]
    @RoleName VARCHAR(100)
AS
BEGIN
INSERT INTO [eventos].[Role] (RoleName)
VALUES                       (@RoleName)
END;
