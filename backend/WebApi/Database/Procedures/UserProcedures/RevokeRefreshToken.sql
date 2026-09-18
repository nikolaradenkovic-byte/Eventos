CREATE PROCEDURE [eventos].[RevokeRefreshToken]
    @TokenId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE [eventos].[RefreshTokens]
    SET [RevokedAt] = GETUTCDATE()
    WHERE [Id] = @TokenId;
END;
GO