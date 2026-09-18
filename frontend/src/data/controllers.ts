import type { User } from "@shared/types/User";

export type MockController = User & {
  busyDates: string[];
};

export const mockControllers: MockController[] = [
  {
    id: "3fe1f772-a397-416a-849d-f8dc6ad77965",
    firstName: "Marko",
    lastName: "Markovic",
    email: "marko@gmail.com",
    roleId: "controller",
    busyDates: ["2026-09-03", "2026-09-05"],
  },
  {
    id: "4f102924-3e42-43d3-92f4-0dcc335bf6ef",
    firstName: "Ana",
    lastName: "Anić",
    email: "ana@gmail.com",
    roleId: "controller",
    busyDates: ["2026-09-04"],
  },
];
