CREATE TABLE [eventos].[RefreshTokens] (
    [Id] UNIQUEIDENTIFIER       NOT NULL CONSTRAINT [DF_RefreshTokens_Id]        DEFAULT NEWID(),
    [UserId] UNIQUEIDENTIFIER   NOT NULL,
    [TokenHash] NVARCHAR(255)   NOT NULL,
    [ExpiresAt] DATETIME2       NOT NULL,
    [CreatedAt] DATETIME2       NOT NULL CONSTRAINT [DF_RefreshTokens_CreatedAt]  DEFAULT SYSUTCDATETIME(),
    [RevokedAt] DATETIME2       NULL,
    
    CONSTRAINT [PK_RefreshTokens]       PRIMARY KEY CLUSTERED   ([Id] ASC),
    CONSTRAINT [FK_RefreshTokens_Users] FOREIGN KEY             ([UserId]) REFERENCES [eventos].[User]([Id]) ON DELETE CASCADE
);
GO

CREATE NONCLUSTERED INDEX [IX_RefreshTokens_UserId] 
ON [eventos].[RefreshTokens]([UserId] ASC);
GO