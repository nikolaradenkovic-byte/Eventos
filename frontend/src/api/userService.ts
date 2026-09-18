import type { User, UserTickets } from "@shared/types/User";
import { ApiClient } from "./apiClient";
import { mockControllers } from "../data/controllers";

export async function getUser(): Promise<User> {
  const response = await ApiClient.get<User>("/api/auth/me");

  return response.data;
}

{
  /* Funkcija koja ce se koristiti kada dobijem endpoint */
}
/*export async function getAvailableControllers(
  startTime: string,
  endTime: string,
): Promise<User[]> {
  const response = await ApiClient.get<User[]>(
    "/api/users/available-controllers",
    {
      params: {
        startTime,
        endTime,
      },
    },
  );
  return response.data;
}*/

/*export async function getAvailableControllers(
  startTime: string,
): Promise<User[]> {
  const selectedDate = startTime.split("T")[0];

  const availableControllers = mockControllers.filter(
    (controllor) => !controllor.busyDates.includes(selectedDate),
  );

  return Promise.resolve(availableControllers);
}*/

export async function getAllUsers(): Promise<User[]> {
  const response = await ApiClient.get<User[]>("/api/users");

  return response.data;
}

export async function updateUserRole(
  user: User,
  roleId: string,
): Promise<void> {
  await ApiClient.put(`/api/roles/${user.id}`, roleId);
}

export async function updateUser(user: User): Promise<void> {
  await ApiClient.put(`/api/users/${user.id}`, {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    roleId: user.roleId,
  });
}

export async function getMyPurchases(): Promise<UserTickets[]> {
  const response = await ApiClient.get<UserTickets[]>(
    "/api/users/my-purchases",
  );

  return response.data;
}
