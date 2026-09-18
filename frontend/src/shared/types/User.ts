export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
};

export type Ticket = {
  ticketId: string;
  eventId: string;
  eventName: string;
  startTime: string;
  locationName: string;
  isUsed: boolean;
};

export type UserTickets = {
  id: string;
  createdAt: string;
  tickets: Ticket[];
};
