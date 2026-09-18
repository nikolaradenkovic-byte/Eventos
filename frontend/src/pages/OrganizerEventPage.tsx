import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import { getEvents } from "../api/eventsService";
import type { Event } from "@shared/types/Event";

function OrganizerEventPage() {
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [error, setError] = useState("");

  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("OrganizerPage mora biti u okviru AuthProvider-a");
  }

  const { currentUser } = authContext;
  const organizerId = currentUser?.id;

  useEffect(() => {
    async function loadMyEvents() {
      if (!organizerId) {
        return;
      }

      try {
        const allEvents = await getEvents();

        if (allEvents) {
          const organizerEvents = allEvents.filter(
            (event) => event.userId === organizerId,
          );

          setMyEvents(organizerEvents);
        }
      } catch (error) {
        console.error("Greska pri učitavanju događaja organizatora.", error);
      }
    }
    loadMyEvents();
  }, [organizerId]);
  return (
    <div>
      <h1></h1>
    </div>
  );
}
export default OrganizerEventPage;
