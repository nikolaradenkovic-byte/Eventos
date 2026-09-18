import type { CreateEventRequest } from "@shared/types/CreateEventRequest";
import type { Event } from "../shared/types/Event";
import { ApiClient } from "./apiClient";
import type { User } from "@shared/types/User";
import type { Statistics, StatisticsCompare } from "@shared/types/Statistics";

export async function getEvents(): Promise<Event[]> {
  const response = await ApiClient.get<Event[]>("/api/events");

  return response.data;
}

export async function getEventsByCategory(
  categoryId: string,
): Promise<Event[]> {
  const response = await ApiClient.get<Event[]>(
    `/api/events/category/${categoryId}`,
  );

  return response.data;
}

export async function getEventsById(id: string): Promise<Event | null> {
  const response = await ApiClient.get(`/api/events/${id}`);

  return response.data;
}

export async function createEvent(
  eventData: CreateEventRequest,
): Promise<boolean> {
  try {
    const formData = new FormData();

    formData.append("userId", eventData.userId);
    formData.append("categoryId", eventData.categoryId);
    formData.append("eventName", eventData.eventName);
    formData.append("description", eventData.description);
    formData.append("locationName", eventData.locationName);
    formData.append("capacity", eventData.capacity.toString());
    formData.append("ticketCost", eventData.ticketCost.toString());
    formData.append("isCanceled", eventData.isCanceled.toString());
    formData.append("startTime", eventData.startTime);
    formData.append("endTime", eventData.endTime);

    console.log(eventData.image);

    if (eventData.image) {
      formData.append("imageFile", eventData.image);
    }

    eventData.controllerIds.forEach((controllerId) => {
      formData.append("controllerIds", controllerId);
    });

    await ApiClient.post("/api/events", formData);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getAvailableControllers(
  startTime: string,
): Promise<User[]> {
  const response = await ApiClient.post<User[] | undefined>(
    "/api/events/availablecontrollers",
    JSON.stringify(startTime),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return response.data ?? [];
}

export async function getAssignedControllers(eventId: string): Promise<User[]> {
  const response = await ApiClient.get<User[]>(
    `/api/events/${eventId}/controllers`,
  );

  return response.data;
}

export async function getMyEvents(): Promise<Event[]> {
  const response = await ApiClient.get<Event[]>("/api/events/myevents");

  return response.data;
}

export async function getMyEventsStatistics(
  eventIds: string[],
): Promise<StatisticsCompare[]> {
  const response = await ApiClient.get<StatisticsCompare[]>(
    "/api/events/statistics/compare",
    {
      params: {
        eventIds,
      },
      paramsSerializer: {
        indexes: null,
      },
    },
  );

  return response.data;
}

export async function cancelEvent(eventId: string): Promise<boolean> {
  const response = await ApiClient.get(`/api/events/${eventId}/cancel`);

  return response.data;
}

export async function deleteEvent(eventId: string): Promise<boolean> {
  const response = await ApiClient.delete(`/api/events/${eventId}`);

  return response.data;
}

export async function getEventStatistics(eventId: string): Promise<Statistics> {
  const response = await ApiClient.get(`/api/events/${eventId}/statistics`);

  return response.data;
}

export async function getEventImage(eventId: string): Promise<File> {
  const response = await ApiClient.get(`/api/events/${eventId}/image`);

  console.log(response.data);
  return response.data;
}

export async function addControllersToEvent(
  eventId: string,
  controllerIds: string[],
): Promise<void> {
  await ApiClient.post(`/api/events/${eventId}/addcontrollers`, controllerIds);
}

export async function updateEvent(
  eventId: string,
  eventData: CreateEventRequest,
): Promise<boolean> {
  try {
    const formData = new FormData();

    formData.append("userId", eventData.userId);
    formData.append("categoryId", eventData.categoryId);
    formData.append("eventName", eventData.eventName);
    formData.append("description", eventData.description);
    formData.append("locationName", eventData.locationName);
    formData.append("capacity", eventData.capacity.toString());
    formData.append("ticketCost", eventData.ticketCost.toString());
    formData.append("isCanceled", eventData.isCanceled.toString());
    formData.append("startTime", eventData.startTime);
    formData.append("endTime", eventData.endTime);

    eventData.controllerIds.forEach((controllerId) => {
      formData.append("controllerIds", controllerId);
    });

    if (eventData.image) {
      formData.append("imageFile", eventData.image);
    }

    await ApiClient.put(`/api/events/${eventId}`, formData);

    return true;
  } catch (error) {
    console.error("Greška prilikom izmene događaja: ", error);
    return false;
  }
}
