import type { Event } from "@shared/types/Event";
import Button from "../global/Button";
import { formatEventDate } from "../../shared/functions/formatEventDate";

type CartItemProps = {
  event: Event;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

function CartItem({
  event,
  quantity,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  const itemTotal = event.ticketCost * quantity;
  const { date, time } = formatEventDate(event.startTime);

  return (
    <div className="flex flex-row h-full w-full gap-7 rounded-[25px] border border-[#5D5D5D] p-8 text-white">
      <div className="flex flex-1 flex-col h-full justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-xl font-semibold">{event.eventName}</p>

          <div>
            <p className="mt-2 text-gray-300">
              {date} - {time}
            </p>

            <p className="mt-1 text-gray-300">{event.locationName}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#5D5D5D] pt-4 mt-6">
          <div className="flex justify-between">
            <p className="text-m text-[#B9B9B9]">Cena karte</p>
            <p className="text-m text-[#B9B9B9]"> {event.ticketCost},00 RSD</p>
          </div>

          <div className="flex flex-row justify-between w-full">
            <p className="text-m text-[#B9B9B9]">Količina</p>
            <div className="flex flex-row justify-between items-center gap-4 ">
              <Button
                type="button"
                label="-"
                onClick={onDecrease}
                className="flex cursor-pointer text-xl items-center justify-center  h-9 w-9 bg-[#767676] rounded-xl px-3 py-1"
              />
              <p className="text-m">{quantity}</p>

              <Button
                type="button"
                label="+"
                onClick={onIncrease}
                className="flex cursor-pointer text-xl items-center justify-center  h-9 w-9 bg-[#767676] rounded-xl px-3 py-1"
              />
            </div>
          </div>

          <Button
            type="button"
            label="Ukloni"
            onClick={onRemove}
            className="bg-[#ADADAD] py-2 rounded-xl cursor-pointer hover:bg-[#909090] transition-colors duration-500 text-[16px] font-semibold"
          />
        </div>
      </div>

      <div>
        <img
          alt="Slika dogadjaja"
          className="rounded-[25px] w-[216px] h-[312px] text-white"
          src={`https://eventosapi-abeueqcbg8grcqfe.austriaeast-01.azurewebsites.net/api/events/${event.id}/image`}
        />
      </div>
    </div>
  );
}
export default CartItem;
