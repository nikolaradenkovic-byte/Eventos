CREATE PROCEDURE [eventos].[GetActiveRefreshTokensByUserId]
    @UserId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
            [Id],
            [UserId],
            [TokenHash],
            [ExpiresAt]
    FROM    [eventos].[RefreshTokens]
    WHERE   [UserId] = @UserId 
    AND     [RevokedAt] IS NULL 
    AND     [ExpiresAt] > GETUTCDATE();
END;
GO