CREATE TABLE [eventos].[Role]
(
    [Id]        UNIQUEIDENTIFIER    NOT NULL CONSTRAINT [DF_Role_Id]        DEFAULT NEWID(),
    [RoleName]  NVARCHAR(100)       NOT NULL,

    CONSTRAINT [PK_Role_Id]         PRIMARY KEY         ([Id]),
    CONSTRAINT [UNQ_Role_RoleName]  UNIQUE              ([RoleName])
);