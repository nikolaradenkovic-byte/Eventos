CREATE PROCEDURE [eventos].[Order_GetByUserId]
    @UserId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;

    SELECT DISTINCT
        O.[Id],
        O.[CreatedAt]
    FROM [eventos].[Order] O
    INNER JOIN [eventos].[OrderMap] OM
        ON OM.[OrderId] = O.[Id]
    WHERE OM.[UserId] = @UserId
    ORDER BY O.[CreatedAt] DESC;
END;
GO