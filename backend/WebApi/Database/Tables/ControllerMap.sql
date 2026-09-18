CREATE TABLE [eventos].[ControllerMap] 
(
    [Id]        UNIQUEIDENTIFIER    NOT NULL CONSTRAINT [DF_ControllerMap_Id] DEFAULT NEWID(),
    [UserId]    UNIQUEIDENTIFIER    NOT NULL,
    [EventId]   UNIQUEIDENTIFIER    NOT NULL,
    
    CONSTRAINT  [PK_ControllerMap_Id]   PRIMARY KEY     ([Id]),
    CONSTRAINT  [FK_Category_UserId]    FOREIGN KEY     ([UserId])      REFERENCES [eventos].[User]     ([Id]),
    CONSTRAINT  [FK_Category_EventId]   FOREIGN KEY     ([EventId])     REFERENCES [eventos].[Event]    ([Id])
);