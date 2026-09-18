export type Event = {
  id: string;
  userId: string;
  categoryId: string;
  imagePath: string | null;
  eventName: string;
  description: string | null;
  locationName: string;
  capacity: number | null;
  ticketCost: number;
  isCanceled: boolean;
  startTime: string;
  endTime: string | null;
  image: File | null;
};
