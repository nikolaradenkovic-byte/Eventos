import type { CartItemType } from "@shared/types/CartItemType";
import { useState, type ReactNode } from "react";
import CartContext from "./CartContext";

type CartProviderProps = {
  children: ReactNode;
};

function CartProvider({ children }: CartProviderProps) {
  const storedCart = localStorage.getItem("cart");

  const [cart, setCart] = useState<CartItemType[]>(
    storedCart ? JSON.parse(storedCart) : [],
  );

  const cartCount = cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  function addToCart(eventId: string, quantity: number) {
    const existingItem = cart.find((item) => eventId === item.eventId);

    let newCart;

    if (existingItem) {
      newCart = cart.map((item) =>
        item.eventId === eventId
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      );
    } else {
      newCart = [...cart, { eventId, quantity }];
    }

    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  }

  function removeFromCart(eventId: string) {
    const newCart = cart.filter((item) => item.eventId !== eventId);

    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  }

  function clearCart() {
    setCart([]);
    localStorage.removeItem("cart");
  }

  return (
    <CartContext.Provider
      value={{ cart, cartCount, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
export default CartProvider;
