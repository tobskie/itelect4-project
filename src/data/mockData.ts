// src/data/mockData.ts
// GT2 kept every mock array at the top of App.tsx. Now that the UI is split
// across pages, more than one page needs the same tutors, sessions and
// bookings -- so the data moves into its own file.
import type { TutoringUser, Session, Booking } from "../types/index";
import { BookingStatus } from "../types/index";

// ===== TUTORS =====
export const allTutors: TutoringUser[] = [
  {
    id: 1,
    name: "Toby Olimpo",
    email: "tobster@example.com",
    role: "tutor",
    isActive: true,
    bio: "4th yr BSIT Student. magaling sya, oo hehehe.",
    subjects: ["ITELECT4", "Data Structures", "Next.js"],
  },
  {
    id: 2,
    name: "Rio Amor",
    email: "rioamor@example.com",
    role: "tutor",
    isActive: false,
    bio: "3rd yr BSIT Student. magaling din sya",
    subjects: ["ITELECT4", "Data Structures", "Next.js"],
  },
];

// ===== THE SIGNED-IN TUTEE =====
export const currentTutee: TutoringUser = {
  id: 3,
  name: "Anton Olimpo",
  email: "antonolimpo@example.com",
  role: "tutee",
  isActive: true,
};

// ===== SESSIONS =====
export const allSessions: Session[] = [
  {
    id: 101,
    tutorId: 1,
    subject: "ITELECT4",
    description: "Vite + React + TS Component Scaffolding Lab",
    scheduledAt: new Date("2026-07-20T14:00:00"),
    durationMinutes: 60,
    maxSlots: 3,
  },
  {
    id: 102,
    tutorId: 2,
    subject: "Calculus",
    description: "Integration Techniques & Practical Review",
    scheduledAt: new Date("2026-07-22T09:30:00"),
    durationMinutes: 90,
    maxSlots: 5,
  },
];

// ===== BOOKINGS -- the starting state of the booking store =====
export const initialBookings: Booking[] = [
  {
    id: 201,
    sessionId: 101,
    tuteeId: 3,
    status: BookingStatus.Requested,
    requestedAt: new Date(),
    notes: "Please cover React component props typing.",
  },
  {
    id: 202,
    sessionId: 102,
    tuteeId: 3,
    status: BookingStatus.Confirmed,
    requestedAt: new Date(),
    notes: "Need help with trig integration.",
  },
];

// ===== SHARED LOOKUP HELPERS =====
// Several pages turn an id into a readable name, so the lookups live here
// instead of being re-written in each page.
export const findTutorById = (tutorId: number): TutoringUser | undefined =>
  allTutors.find((t) => t.id === tutorId);

export const findSessionById = (sessionId: number): Session | undefined =>
  allSessions.find((s) => s.id === sessionId);

export const getTutorName = (tutorId: number): string =>
  findTutorById(tutorId)?.name ?? "Unknown";

export const getSessionSubject = (sessionId: number): string =>
  findSessionById(sessionId)?.subject ?? "Unknown";
