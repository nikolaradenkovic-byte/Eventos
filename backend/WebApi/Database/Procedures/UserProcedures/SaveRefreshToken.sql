CREATE PROCEDURE [eventos].[SaveRefreshToken]
    @UserId UNIQUEIDENTIFIER,
    @TokenHash NVARCHAR(255),
    @ExpiresAt DATETIME2
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO [eventos].[RefreshTokens]   (UserId,  TokenHash,  ExpiresAt,     CreatedAt)
    VALUES                                  (@UserId, @TokenHash, @ExpiresAt, GETUTCDATE());
END;
GO