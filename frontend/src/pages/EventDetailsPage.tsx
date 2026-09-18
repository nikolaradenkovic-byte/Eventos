import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventsById } from "../api/eventsService";
import type { Event } from "@shared/types/Event";
import EventInfo from "../components/events/EventInfo";

function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | undefined>(undefined);

  useEffect(() => {
    async function loadEvent() {
      if (!id) return;

      const receivedEvent = await getEventsById(id);

      if (!receivedEvent) return;

      setEvent(receivedEvent);
    }

    loadEvent();
  }, [id]);

  return (
    <div className="flex flex-col  w-full py-[140px] pl-[155px] pr-[155px]">
      <div className="flex flex-row mx-auto w-[90%] py-14 px-23 gap-20 min-h-[400px] rounded-2xl border-white/10 shadow-2xl text-white bg-gradient-to-br from-[#303030] via-[#242424] to-[#171717]">
        <div className="h-[400px] w-[350px] shrink-0 overflow-hidden rounded-lg bg-[#303030]">
          <img
            src={`https://eventosapi-abeueqcbg8grcqfe.austriaeast-01.azurewebsites.net/api/events/${event?.id}/image`}
            alt="Slika dogadjaja"
            className="h-full w-full object-cover"
          ></img>
        </div>

        {event && <EventInfo event={event} />}
      </div>

      <div className="flex flex-col gap-3 mx-auto mt-10 w-[90%] p-10 bg-[#202020] rounded-lg">
        <h2 className="text-xl font-semibold text-white">Opis dogadjaja</h2>
        <p className="text-[#8B8B8B]">{event?.description}</p>
      </div>
    </div>
  );
}
export default EventDetailsPage;
