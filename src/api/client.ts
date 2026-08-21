// src/api/client.ts -- a NEW file
// Every call to json-server lives in this one file. No component calls fetch.
// When a real deployed backend replaces json-server, only API_URL changes.
import type {
  ApiUser,
  ApiSession,
  ApiBooking,
  NewBooking,
  BookingPatch,
} from "../types/index";

export const API_URL = "http://localhost:3001";

// ===== TUTORS =====

// GET /tutors -> the whole directory
export async function fetchTutors(): Promise<ApiUser[]> {
  const res = await fetch(`${API_URL}/tutors`);
  if (!res.ok) {
    throw new Error("Could not load tutors");
  }
  return res.json();
}

export async function fetchTutorById(tutorId: string): Promise<ApiUser> {
  const res = await fetch(`${API_URL}/tutors/${tutorId}`);
  if (!res.ok) {
    throw new Error(`No tutor found with id "${tutorId}".`);
  }
  return res.json();
}

// ===== SESSIONS =====

// GET /sessions -> every session on offer
export async function fetchSessions(): Promise<ApiSession[]> {
  const res = await fetch(`${API_URL}/sessions`);
  if (!res.ok) {
    throw new Error("Could not load sessions");
  }
  return res.json();
}

// There is deliberately NO fetchSessionsByTutor here.
// GET /sessions?tutorId=1 looks like the obvious way to get one tutor's
// sessions, and it returns [] every time: json-server 1.x turns a
// numeric-looking query value into the NUMBER 1, while our ids are the STRINGS
// json-server itself wrote. Nothing errors -- the list is just always empty.
// A filter on a text field (?subject=ITELECT4) works fine, which is what makes
// the failure so easy to miss.
// TutorDetailPage therefore reads the shared ["sessions"] cache entry and
// filters it in the page. On a list this size that is one request FEWER, since
// the Sessions page has usually already fetched it.

// ===== BOOKINGS =====

// GET /bookings
export async function fetchBookings(): Promise<ApiBooking[]> {
  const res = await fetch(`${API_URL}/bookings`);
  if (!res.ok) {
    throw new Error("Could not load bookings");
  }
  return res.json();
}

// POST /bookings -> the row the server saved, with the id it made
export async function createBooking(
  newBooking: NewBooking
): Promise<ApiBooking> {
  const res = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newBooking),
  });
  if (!res.ok) {
    throw new Error("Could not save the booking");
  }
  return res.json();
}

// PATCH /bookings/:id -> the updated row.
// PATCH, not PUT: PUT replaces the whole row, so every field we left out would
// be wiped. PATCH merges, which is what "change the status" actually means.
export async function updateBooking(
  bookingId: string,
  patch: BookingPatch
): Promise<ApiBooking> {
  const res = await fetch(`${API_URL}/bookings/${bookingId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) {
    throw new Error("Could not update the booking");
  }
  return res.json();
}
