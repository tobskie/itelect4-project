// src/api/client.ts
// Every call the app makes lives in this one file. No component calls fetch.
//
// ===== SESSIONS 7-8: one hard-coded host, and no token anywhere ==========
// export const API_URL = "http://localhost:3001";
//
// export async function fetchTutors(): Promise<ApiUser[]> {
//   const res = await fetch(`${API_URL}/tutors`);
//   if (!res.ok) {
//     throw new Error("Could not load tutors");
//   }
//   return res.json();
// }
//
// ... and the same four lines again for every other call, each with its
// own guessed message.
//
// NOTE: Three things are wrong with that now. The host is written into the
//       code, so the deployed app would still call your laptop. Nothing
//       sends a token, so every /api/bookings call is 401. And every
//       message above was invented here -- the real API says "Email or
//       password is incorrect", and nobody ever read it.
// ===== GT4 PART 2: one request() helper, and a host from the env =========
import type {
  ApiUser,
  ApiSession,
  ApiBooking,
  NewBooking,
  BookingPatch,
  AuthReply,
  AiReview,
} from "../types/index";
import useAuthStore from "../store/authStore";

// Vite only exposes variables whose name starts with VITE_, and it replaces
// this at BUILD time -- whatever was in .env (or in Vercel's settings) when
// `npm run build` ran is baked into the bundle. Changing it later means
// building again.
export const API_URL = import.meta.env.VITE_API_URL;

// A sentence now beats every call going to "undefined/api/tutors".
if (!API_URL) {
  throw new Error(
    "VITE_API_URL is missing. Copy .env.example to .env, fill it in, " +
      "and restart npm run dev."
  );
}

// Every call goes through here: the host, the JSON header, the token when
// there is one, and the API's own message when it refuses.
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  // getState(), not the useAuthStore hook -- this is not a component. It
  // only needs whatever the token is at the moment of the call.
  const token = useAuthStore.getState().token;

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      // The exact header requireAuth reads. No token means no header at
      // all, which is what the public tutor and session routes want.
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (!res.ok) {
    // Every refusal this API sends has a message field -- and a 400 from
    // the schema adds the list of rules that failed.
    const body = await res.json().catch(() => null);
    const detail = body?.errors?.length ? `: ${body.errors.join(", ")}` : "";
    throw new Error(`${body?.message ?? `Request failed (${res.status})`}${detail}`);
  }

  // 204 No Content has no body to parse.
  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

// ===== TUTORS -- public. request() sends no token, and none is needed. =====

export function fetchTutors(): Promise<ApiUser[]> {
  return request<ApiUser[]>("/api/tutors");
}

// A bad id answers 404, and request() throws the sentence the API sent.
export function fetchTutorById(tutorId: string): Promise<ApiUser> {
  return request<ApiUser>(`/api/tutors/${tutorId}`);
}

// ===== SESSIONS -- public, and what the booking form's dropdown reads =====

export function fetchSessions(): Promise<ApiSession[]> {
  return request<ApiSession[]>("/api/sessions");
}

// ===== BOOKINGS -- private. The token goes on automatically. =====

// Only this token's bookings: the API filters by the owner, not us.
export function fetchBookings(): Promise<ApiBooking[]> {
  return request<ApiBooking[]>("/api/bookings");
}

export function createBooking(newBooking: NewBooking): Promise<ApiBooking> {
  return request<ApiBooking>("/api/bookings", {
    method: "POST",
    body: JSON.stringify(newBooking),
  });
}

// PATCH, not PUT: PUT replaces the whole row, so every field we left out
// would be wiped. PATCH merges, which is what "change the status" means.
export function updateBooking(
  bookingId: string,
  patch: BookingPatch
): Promise<ApiBooking> {
  return request<ApiBooking>(`/api/bookings/${bookingId}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

// ===== AUTH -- the two routes that make a session exist =====

export function registerUser(body: {
  name: string;
  email: string;
  password: string;
}): Promise<ApiUser> {
  return request<ApiUser>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function loginUser(body: {
  email: string;
  password: string;
}): Promise<AuthReply> {
  return request<AuthReply>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// ===== SESSION 11: one more private call ===============================
// ---- ai: private, like bookings. The token goes on automatically,
// which matters more here than anywhere: without it, anyone could
// spend your Gemini quota.
export function askAi(prompt: string): Promise<AiReview> {
  return request<AiReview>("/api/ai", {
    method: "POST",
    body: JSON.stringify({ prompt }),
  });
}

