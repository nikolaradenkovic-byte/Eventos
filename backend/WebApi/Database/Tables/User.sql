CREATE TABLE [eventos].[User]
(
    [Id]        UNIQUEIDENTIFIER    NOT NULL    CONSTRAINT [DF_User_Id]         DEFAULT NEWID(),
    [RoleId]    UNIQUEIDENTIFIER    NOT NULL,
    [Email]     NVARCHAR(100)       NOT NULL,
    [Password]  NVARCHAR(100)       NOT NULL,
    [FirstName] NVARCHAR(100)       NOT NULL,
    [LastName]  NVARCHAR(100)       NOT NULL,
    [CreatedAt] DATETIME2           NOT NULL    CONSTRAINT [DF_User_CreatedAt]  DEFAULT SYSUTCDATETIME(),

    CONSTRAINT [PK_User_Id]         PRIMARY KEY ([Id]),
    CONSTRAINT [FK_User_RoleId]     FOREIGN KEY ([RoleId]) REFERENCES [eventos].[Role] ([Id]),
    CONSTRAINT [UNQ_User_Email]     UNIQUE      ([Email]),
);