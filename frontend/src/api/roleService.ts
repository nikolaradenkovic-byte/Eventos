import type { Role } from "@shared/types/Role";
import { ApiClient } from "./apiClient";

export async function getRoles(): Promise<Role[]> {
  const response = await ApiClient.get<Role[]>("/api/roles");

  return response.data;
}
