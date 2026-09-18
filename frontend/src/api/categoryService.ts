import type { Category } from "@shared/types/Category";
import { ApiClient } from "./apiClient";

export async function getCategories(): Promise<Category[]> {
  const response = await ApiClient.get<Category[]>("/api/categories");

  return response.data;
}
