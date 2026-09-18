import type { Event } from "@shared/types/Event";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getEventStatistics } from "../../api/eventsService";
import type { Statistics } from "@shared/types/Statistics";

type OrganizerEventCardProps = {
  event: Event;
  onViewSalesDetails: () => void;
  onEditEvent: () => void;
};

function OrganizerEventCard({
  event,
  onViewSalesDetails,
  onEditEvent,
}: OrganizerEventCardProps) {
  const [statistics, setStatistics] = useState<Statistics | undefined>(
    undefined,
  );
  useEffect(() => {
    async function loadStatistics() {
      if (!event) return;

      const receivedStatistics = await getEventStatistics(event.id);

      if (!receivedStatistics) return;

      setStatistics(receivedStatistics);
    }

    loadStatistics();
  }, [event.id]);

  return (
    <div>
      <div className="flex w-full items-center gap-10 rounded-2xl border border-gray-200 bg-white px-8 py-5 shadow-[0_8px_8px_-8px_rgba(0,0,0,0.3)] ">
        <div className="flex flex-row w-1/2 items-center">
          <img
            className="h-[120px] w-[180px] shrink-0 rounded-2xl object-cover"
            src={`https://eventosapi-abeueqcbg8grcqfe.austriaeast-01.azurewebsites.net/api/events/${event?.id}/image`}
          />

          <div className="flex flex-1 flex-col p-4 whitespace-nowrap gap-2 w-[150px]">
            <h2 className="text-[20px] font-bold text-black">
              {event.eventName}
            </h2>

            <div className="flex flex-col text-m text-[#B2B2B2]">
              <p>{new Date(event.startTime).toLocaleDateString("sr-RS")}</p>

              <p>{event.locationName}</p>
            </div>

            <div className="h-px w-full bg-[#EFEFEF]"></div>
            <p className="text-m text-[#B2B2B2]">
              Status:{" "}
              <span
                className={
                  event.isCanceled ? " text-gray-400" : " text-[#F18700]"
                }
              >
                {event.isCanceled ? "Otkazan" : "Aktivan"}
              </span>
            </p>
          </div>
        </div>
        {statistics && (
          <div className="grid grid-cols-3 gap-x-20 gap-y-5 w-max-[400px] px-20">
            <StatisticItem
              label="Ukupna prodaja"
              value={`${statistics.soldTickets} karte`}
            />

            <StatisticItem
              label="Prihod"
              value={`${statistics.revenue.toLocaleString("sr-RS")} RSD`}
            />

            <StatisticItem
              label="Popunjenost"
              value={`${statistics.occupancyPercentage}%`}
            />

            <StatisticItem
              label="Preostalo"
              value={`${statistics.remainingTickets} karte`}
            />

            <StatisticItem
              label="Iskorišćeno"
              value={`${statistics.usedTickets} karte`}
            />

            <StatisticItem
              label="Prosečna cena"
              value={
                statistics.soldTickets > 0
                  ? `${(
                      statistics.revenue / statistics.soldTickets
                    ).toLocaleString("sr-RS")} RSD`
                  : "0 RSD"
              }
            />
          </div>
        )}
        <div className=" flex flex-col justify-center items-center gap-3 sm:flex-row">
          {/* <button
            type="button"
            onClick={onViewSalesDetails}
            className="rounded-full border px-7 py-2"
          >
            Pregledaj prodaju
          </button> */}

          <button
            type="button"
            onClick={onEditEvent}
            className="rounded-lg bg-[#E98400] text-white px-7 py-2"
          >
            Izmeni
          </button>
        </div>
      </div>
    </div>
  );
}
type StatisticItemProps = {
  label: string;
  value: string;
};

function StatisticItem({ label, value }: StatisticItemProps) {
  return (
    <div className="flex min-h-[44px] gap-3">
      <div className="w-[2px] shrink-0 rounded-full bg-orange-400" />

      <div>
        <p className="mb-1 text-sm text-gray-400">{label}</p>
        <p className="text-sm font-medium text-[#181818]">{value}</p>
      </div>
    </div>
  );
}
export default OrganizerEventCard;
