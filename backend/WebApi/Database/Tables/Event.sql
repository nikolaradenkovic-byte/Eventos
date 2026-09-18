CREATE TABLE [eventos].[Event]
(
    [Id]            UNIQUEIDENTIFIER    NOT NULL        CONSTRAINT [DF_Event_Id]            DEFAULT NEWID(),
    [UserId]        UNIQUEIDENTIFIER    NOT NULL,
    [CategoryId]    UNIQUEIDENTIFIER    NOT NULL,
    [ImagePath]     NVARCHAR(MAX)       NULL,
    [EventName]     NVARCHAR(100)       NOT NULL,
    [Description]   NVARCHAR(255)       NULL,
    [LocationName]  NVARCHAR(30)        NOT NULL,
    [Capacity]      INT                 NULL,
    [TicketCost]    DECIMAL(7,2)        NOT NULL,
    [IsCanceled]    BIT                 NOT NULL        CONSTRAINT [DF_Event_IsCanceled]    DEFAULT 0,
    [IsActive]      BIT                 NOT NULL        CONSTRAINT [DF_Event_IsActive]      DEFAULT 1,
    [StartTime]     DATETIME2           NOT NULL,
    [EndTime]       DATETIME2           NULL,

    
    CONSTRAINT [PK_Event]               PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Event_UserId]        FOREIGN KEY ([UserId])      REFERENCES [eventos].[User]     ([Id]),
    CONSTRAINT [FK_Event_CategoryId]    FOREIGN KEY ([CategoryId])  REFERENCES [eventos].[Category] ([Id])
);