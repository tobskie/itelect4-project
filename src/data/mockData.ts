// src/data/mockData.ts
// SESSION 7: allTutors, allSessions, initialBookings and the lookup helpers are
// DELETED. They live in db.json now, and the app fetches them instead of
// importing them -- nothing may import mock data that a query replaced.
//
// `currentTutee` stays. There is no /users endpoint and no real login yet: the
// login page mints a demo token from a name alone, so the tutee whose bookings
// we create still has to be hard-coded, on purpose.
import type { ApiUser } from "../types/index";

export const currentTutee: ApiUser = {
  id: "4", // a string, to match the ids json-server hands back
  name: "Anton Olimpo",
  email: "antonolimpo@example.com",
  role: "tutee",
  isActive: true,
};
