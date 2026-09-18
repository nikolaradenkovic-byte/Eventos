import type { CartItemType } from "@shared/types/CartItemType";
import { createContext } from "react";

type CartContextType = {
  cart: CartItemType[];
  cartCount: number;
  addToCart: (eventId: string, quantity: number) => void;
  removeFromCart: (eventId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export default CartContext;
