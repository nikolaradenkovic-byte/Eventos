CREATE TABLE [eventos].[Order]
(
    [Id]        UNIQUEIDENTIFIER    NOT NULL    CONSTRAINT [DF_Order_Id]        DEFAULT NEWID(),
    [CreatedAt] DATETIME2           NOT NULL    CONSTRAINT [DF_Order_CreatedAt] DEFAULT SYSUTCDATETIME(),
    
    CONSTRAINT [PK_Order]           PRIMARY KEY ([Id]),
);