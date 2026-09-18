import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import {
  cancelEvent,
  deleteEvent,
  getEvents,
  getMyEvents,
  getMyEventsStatistics,
} from "../../api/eventsService";
import type { Event } from "@shared/types/Event";
import { useNavigate } from "react-router-dom";
import OrganizerEventCard from "../../components/organizer/OrganizerEventCard";

import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";
import type { StatisticsCompare } from "@shared/types/Statistics";

function OrganizerEventsStatisticsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [statistics, setStatistics] = useState<StatisticsCompare[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);

  if (!authContext) {
    throw new Error(
      "OrganizerEventsStatisticsPage mora biti unutar AuthContext.Provider-a",
    );
  }

  const { currentUser } = authContext;

  useEffect(() => {
    async function loadOrganizerEvents() {
      if (!currentUser) {
        return;
      }

      try {
        setIsLoading(true);

        const organizerEvents = await getMyEvents();
        const eventIds = organizerEvents.map((event) => event.id);
        console.log("ev", eventIds);
        setTimeout(async () => {
          const statisticsResponse = await getMyEventsStatistics(eventIds);
          setStatistics(statisticsResponse);
        }, 2000);

        setEvents(organizerEvents);
      } catch (error) {
        setError("Nije moguće učitati događaje.");
      } finally {
        setIsLoading(false);
      }
    }

    loadOrganizerEvents();
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#F97316]" />
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-full w-full max-w-6xl rounded-[10px] border border-[#E5E5E5] p-4 text-[#333333] md:p-6 lg:p-10">
      <h1 className="mb-10 text-3xl font-semibold text-[#181818] md:text-4xl">
        {" "}
        Statistika događaja
      </h1>
      <div className="h-[350px] w-full rounded-xl bg-white p-6">
        <h2 className="mb-6 text-lg font-semibold text-[#181818]">
          Prihod po događajima
        </h2>

        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={statistics}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="eventName" tick={{ fontSize: 12 }} />

            <YAxis />

            <Tooltip
              formatter={(value) => [
                `${Number(value).toLocaleString("sr-RS")} RSD`,
                "Prihod",
              ]}
            />

            <Bar dataKey="revenue" fill="#8884d8" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
export default OrganizerEventsStatisticsPage;
