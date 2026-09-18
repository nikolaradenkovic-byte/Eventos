CREATE TABLE [eventos].[OrderMap] 
(
    [Id]        UNIQUEIDENTIFIER NOT NULL CONSTRAINT [DF_OrderMap_Id] DEFAULT NEWID(),
    [UserId]    UNIQUEIDENTIFIER NOT NULL,
    [OrderId]    UNIQUEIDENTIFIER NOT NULL,
    
    CONSTRAINT [PK_OrderMap_Id]       PRIMARY KEY ([Id]),
    CONSTRAINT [FK_OrderMap_UserId]   FOREIGN KEY ([UserId]) REFERENCES [eventos].[User] ([Id]),
    CONSTRAINT [FK_OrderMap_OrderId]  FOREIGN KEY ([OrderId]) REFERENCES [eventos].[Order] ([Id])
);