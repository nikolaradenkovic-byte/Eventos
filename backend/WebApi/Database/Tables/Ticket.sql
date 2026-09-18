CREATE TABLE [eventos].[Ticket]
(
    [Id]        UNIQUEIDENTIFIER    NOT NULL CONSTRAINT [DF_Ticket_Id]      DEFAULT NEWID(),
    [OrderId]   UNIQUEIDENTIFIER    NOT NULL,
    [EventId]   UNIQUEIDENTIFIER    NOT NULL,
    [IsUsed]    BIT                 NOT NULL CONSTRAINT [DF_Ticket_IsUser]  DEFAULT 0,
    
    CONSTRAINT [PK_Ticket]         PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Ticket_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [eventos].[Order] ([Id]),
    CONSTRAINT [FK_Ticket_EventId] FOREIGN KEY ([EventId]) REFERENCES [eventos].[Event] ([Id])
);