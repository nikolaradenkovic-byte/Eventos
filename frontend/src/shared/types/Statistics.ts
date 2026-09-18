export type Statistics = {
  soldTickets: number;
  remainingTickets: number;
  revenue: number;
  usedTickets: number;
  occupancyPercentage: number;
};

export type StatisticsCompare = {
  eventId: string;
  eventName: string;
  soldTickets: number;
  remainingTickets: number;
  revenue: number;
  usedTickets: number;
  occupancyPercentage: number;
};
