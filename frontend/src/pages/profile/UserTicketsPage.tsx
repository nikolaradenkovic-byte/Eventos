import { useEffect, useState } from "react";
import { getMyPurchases } from "../../api/userService";
import TicketCard from "../../components/profile/TicketCard";
import type { Ticket, UserTickets } from "@shared/types/User";

function UserTicketsPage() {
  const [tickets, setTickets] = useState<UserTickets[]>([]);
  const [isLoading, setIsloading] = useState<boolean>(false);

  useEffect(() => {
    async function loadTickets() {
      try {
        setIsloading(true);
        const receivedTickets = await getMyPurchases();
        setIsloading(false);
        setTickets(receivedTickets);
      } catch (error) {
        console.error("Greška pri učitavanju ulaznica.", error);
        setIsloading(false);
        setTickets([]);
      }
    }

    loadTickets();
  }, []);
  return (
    <div className="w-full max-w-5xl">
      <h1 className="mb-8 text-3xl font-semibold">Moje karte</h1>
      <div className="flex flex-col gap-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white" />
          </div>
        ) : (
          tickets.map((userTicket) =>
            userTicket.tickets.map((ticket) => (
              <TicketCard
                key={ticket.ticketId}
                eventId={ticket.eventId}
                eventName={ticket.eventName}
                locationName={ticket.locationName}
                startTime={ticket.startTime}
              />
            )),
          )
        )}
      </div>
    </div>
  );
}
export default UserTicketsPage;
