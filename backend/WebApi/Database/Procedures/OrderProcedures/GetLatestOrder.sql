CREATE PROCEDURE [eventos].[GetLastOrder]
AS
BEGIN
SELECT TOP 1
                    [Id],
                    [CreatedAt]
           FROM     [eventos].[Order]
           ORDER BY [CreatedAt] DESC
END;
GO

