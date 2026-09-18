export default function TicketCard({
  eventId,
  eventName,
  startTime,
  locationName,
}) {
  return (
    <div className="flex flex-col rounded-[25px] border border-[#252525] w-2/3">
      <div className="flex flex-row w-full justify-between max-h-[300px] p-3">
        <div className="flex flex-col gap-2">
          <p className="font-bold">{eventName}</p>

          <div className="flex flex-col">
            <p className="">{startTime}</p>
            <p className="">{locationName}</p>
          </div>
        </div>
        <img
          className="rounded-[25px] w-[216px] h-scretch"
          src={`https://eventosapi-abeueqcbg8grcqfe.austriaeast-01.azurewebsites.net/api/events/${eventId}/image`}
          alt="Event image"
        />
      </div>
    </div>
  );
}
