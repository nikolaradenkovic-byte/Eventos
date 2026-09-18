import { Link } from "react-router-dom";
import EventCard from "./EventCard";
import type { Event } from "@shared/types/Event";

type EventSectionProps = {
  title: string;
  categoryId: string;
  events: Event[];
};

function EventSection({ title, events, categoryId }: EventSectionProps) {
  return (
    events && (
      <section className="flex w-full flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{title}</h2>

          <Link
            to={`/events?categoryId=${categoryId}`}
            className="rounded-full border border-white/40 px-5 py-2 text-sm text-white transition hover:bg-white hover:text-black"
          >
            Prikaži
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {events
            .map((event) => (
              <div key={event.id} className="w-[180px] shrink-0">
                <EventCard event={event} />
              </div>
            ))
            .slice(0, 4)}
        </div>
      </section>
    )
  );
}

export default EventSection;
