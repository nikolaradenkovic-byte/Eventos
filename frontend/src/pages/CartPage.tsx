import { useContext, useEffect, useState } from "react";
import Button from "../components/global/Button";
import { useNavigate } from "react-router-dom";
import type { Event } from "@shared/types/Event";
import { getEvents } from "../api/eventsService";
import CartContext from "../context/CartContext";
import CartItem from "../components/cart/CartItem";

function CartPage() {
  const [events, setEvents] = useState<Event[]>([]);

  const cartContext = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadEvents() {
      try {
        const receivedEvents = await getEvents();
        setEvents(receivedEvents);
      } catch (error) {
        console.error("Greska pri ucitavanju dogadjaja", error);
      }
    }
    loadEvents();
  }, []);

  if (!cartContext) {
    throw new Error("CartPage mora biti unutar CartProvider-a.");
  }

  const { cart, addToCart, removeFromCart } = cartContext;

  const totalPrice = cart.reduce((total, item) => {
    const event = events.find((event) => event.id === item.eventId);

    if (!event) return total;

    return total + item.quantity * event.ticketCost;
  }, 0);

  return (
    <div className="flex flex-row w-full gap-10 px-60 py-12">
      <div className="w-full max-w-[845px]">
        <h1 className="mb-6 text-white text-2xl">Pregled korpe</h1>
        <br />

        <div className="flex flex-col gap-5">
          {cart &&
            cart.map((item) => {
              const event = events.find((event) => event.id === item.eventId);

              if (!event) {
                return null;
              }

              return (
                <CartItem
                  key={item.eventId}
                  event={event}
                  quantity={item.quantity}
                  onIncrease={() => addToCart(item.eventId, 1)}
                  onDecrease={() => {
                    if (item.quantity > 1) {
                      addToCart(item.eventId, -1);
                    }
                  }}
                  onRemove={() => removeFromCart(item.eventId)}
                />
              );
            })}
        </div>
      </div>

      <div className="flex flex-col mt-20 w-1/3 h-fit border border-[#5D5D5D] rounded-[25px] p-8 text-white gap-6">
        <div className="border-b pb-3 border-[#5D5D5D]">
          <h1 className="text-[#B9B9B9] text-center"> Pregled porudžbine</h1>
        </div>
        <div className="flex flex-row justify-between">
          <h1 className="text-white font-semibold">UKUPNO:</h1>
          <p>{totalPrice},00 RSD</p>
        </div>

        <Button
          type="button"
          label="Nastavi na plaćanje"
          onClick={() => navigate("/checkout")}
          className="cursor-pointer bg-[#E98400] py-3 rounded-xl px-4 py-1 text-l w-full"
        />
      </div>
    </div>
  );
}
export default CartPage;
