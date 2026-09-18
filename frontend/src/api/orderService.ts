import { ApiClient } from "./apiClient";

export type CreateOrderItemsRequest = {
  eventId: string;
  quantity: number;
};

export type CreateOrderNoAuthRequest = {
  email: string;
  firstName: string;
  lastName: string;
  events: CreateOrderItemsRequest[];
};

export async function createOrderNoAuth(
  orderData: CreateOrderNoAuthRequest,
): Promise<boolean> {
  try {
    await ApiClient.post("/api/orders/noauth", orderData);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function createOrder(
  orderData: CreateOrderItemsRequest[],
): Promise<boolean> {
  try {
    await ApiClient.post("/api/orders/create", orderData);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
