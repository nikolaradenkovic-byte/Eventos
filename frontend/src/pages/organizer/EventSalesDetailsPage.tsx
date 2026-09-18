import type { Statistics } from "@shared/types/Statistics";
import { useState, useEffect } from "react";
import { getEventStatistics } from "../../api/eventsService";
import { useParams } from "react-router-dom";

function EventSalesDetailsPage() {
  const { id } = useParams();
  const [statistics, setStatistics] = useState<Statistics | undefined>(
    undefined,
  );
  useEffect(() => {
    async function loadStatistics() {
      if (!id) return;

      const receivedStatistics = await getEventStatistics(id);

      if (!receivedStatistics) return;

      setStatistics(receivedStatistics);
    }

    loadStatistics();
  }, [id]);
  return (
    <div className="mx-auto min-h-full w-full max-w-6xl rounded-[10px] border border-[#E5E5E5] p-4 text-[#333333] md:p-6 lg:p-10">
      <p>Pregled prodaje</p>
      <div className="w-full rounded-[24px] border border-gray-100 bg-white p-6 shadow-md">
        <h2 className="mb-5 text-sm text-gray-400">Statistika</h2>

        {statistics && (
          <div className="grid grid-cols-1 gap-x-12 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
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

export default EventSalesDetailsPage;
