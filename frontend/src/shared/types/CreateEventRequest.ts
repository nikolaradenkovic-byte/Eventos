export type CreateEventRequest = {
  userId: string;
  categoryId: string;
  image: File | null;
  eventName: string;
  description: string;
  locationName: string;
  capacity: number;
  ticketCost: number;
  isCanceled: boolean;
  startTime: string;
  endTime: string;
  controllerIds: string[];
};
