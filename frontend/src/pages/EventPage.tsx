import { useSearchParams } from "react-router-dom";
import EventCard from "../components/events/EventCard";
import { useEffect, useState } from "react";
import type { Event } from "@shared/types/Event";
import { getEvents, getEventsByCategory } from "../api/eventsService";

function EventPage() {
  const [events, setEvents] = useState<Event[]>([]);

  const [searchParams] = useSearchParams();
  const selectedCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    async function loadEvents() {
      try {
        const receivedEvents = selectedCategoryId
          ? await getEventsByCategory(selectedCategoryId)
          : await getEvents();

        setEvents(receivedEvents);
      } catch (error) {
        console.error("Greška pri učitavanju događaja.", error);
        setEvents([]);
      }
    }

    loadEvents();
  }, [selectedCategoryId]);

  return (
    <div className="w-full px-60 py-15">
      {events.length === 0 ? (
        <p className="text-lg text-white p-10 px-60">
          Trenutno nema događaja u ovoj kategoriji.
        </p>
      ) : (
        <div className="grid grid-cols-5 gap-12 w-full">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

export default EventPage;
