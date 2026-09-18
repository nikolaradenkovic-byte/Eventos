import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import {
  cancelEvent,
  deleteEvent,
  getEvents,
  getMyEvents,
} from "../../api/eventsService";
import type { Event } from "@shared/types/Event";
import { useNavigate } from "react-router-dom";
import OrganizerEventCard from "../../components/organizer/OrganizerEventCard";

function OrganizerEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error(
      "OrganizerEventsPage mora biti unutar AuthContext.Provider-a",
    );
  }

  const { currentUser } = authContext;

  useEffect(() => {
    async function loadOrganizerEvents() {
      if (!currentUser) {
        return;
      }

      try {
        const organizerEvents = await getMyEvents();

        setEvents(organizerEvents);
      } catch (error) {
        setError("Nije moguće učitati događaje.");
      }
    }

    loadOrganizerEvents();
  }, [currentUser]);

  async function handleCancelEvent(eventId: string): Promise<boolean> {
    const success = await cancelEvent(eventId);

    if (success) {
      setEvents((currentEvents) =>
        currentEvents.map((event) =>
          event.id === eventId ? { ...event, isCanceled: true } : event,
        ),
      );
      return true;
    } else {
      return false;
    }
  }

  async function handleDeleteEvent(eventId: string): Promise<boolean> {
    const success = await deleteEvent(eventId);

    if (success) {
      setEvents((currentEvents) =>
        currentEvents.filter((event) => event.id !== eventId),
      );
      return true;
    } else {
      return false;
    }
  }

  return (
    <div className="p-8 text-[#333333]">
      <div className="mb-10 text-3xl font-semibold text-[#181818] md:text-4xl">
        <h1> Pregled događaja</h1>
      </div>

      {events.length === 0 ? (
        <p>Trenutno nemate kreiranih događaja.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {events &&
            events.map((event) => (
              <OrganizerEventCard
                key={event.id}
                event={event}
                onViewSalesDetails={() =>
                  navigate(`/organizer/events/${event.id}/sales`)
                }
                onEditEvent={() =>
                  navigate(`/organizer/events/${event.id}/edit`)
                }
              />
            ))}
        </div>
      )}
    </div>
  );
}
export default OrganizerEventsPage;
