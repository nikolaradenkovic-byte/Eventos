CREATE TABLE [eventos].[Category]
(
    [Id]                UNIQUEIDENTIFIER    NOT NULL CONSTRAINT [DF_Category_Id] DEFAULT NEWID(),
    [CategoryName]      NVARCHAR(100)       NOT NULL,

    CONSTRAINT [PK_Category]                PRIMARY KEY     ([Id]),
    CONSTRAINT [UNQ_Category_CategoryName]  UNIQUE          ([CategoryName])
);