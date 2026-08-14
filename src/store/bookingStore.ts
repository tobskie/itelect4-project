// src/store/bookingStore.ts
// GT2 kept `bookings` in App.tsx useState, so one component owned it. Now the
// booking is CREATED on /sessions and READ on /bookings -- two different pages
// that never render at the same time. A store is the only place that state can
// live and survive the navigation between them.
import { create } from "zustand";
import type { Booking } from "../types/index";
import { BookingStatus } from "../types/index";
import { initialBookings, currentTutee } from "../data/mockData";

// Both cards accept variant?: "default" | "compact", so the density toggle in
// the nav bar has to be readable from every page too.
export type CardVariant = "default" | "compact";

interface BookingState {
  bookings: Booking[];
  cardVariant: CardVariant;
  // Returns a message the page can show in its feedback banner
  requestBooking: (sessionId: number) => string;
  cancelBooking: (bookingId: number) => void;
  updateNotes: (bookingId: number, notes: string) => void;
  setCardVariant: (variant: CardVariant) => void;
}

const useBookingStore = create<BookingState>((set, get) => ({
  bookings: initialBookings,
  cardVariant: "default",

  requestBooking: (sessionId) => {
    // Same duplicate guard GT2 had, moved out of the component
    const alreadyBooked = get().bookings.some(
      (b) => b.sessionId === sessionId && b.status !== BookingStatus.Cancelled
    );
    if (alreadyBooked) {
      return "You already have an active booking for this session.";
    }

    const newBooking: Booking = {
      id: Date.now(),
      sessionId,
      tuteeId: currentTutee.id,
      status: BookingStatus.Requested,
      requestedAt: new Date(),
      notes: "",
    };

    set((state) => ({ bookings: [...state.bookings, newBooking] }));
    return "Booking requested. Check the Bookings page for its status.";
  },

  cancelBooking: (bookingId) =>
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId ? { ...b, status: BookingStatus.Cancelled } : b
      ),
    })),

  updateNotes: (bookingId, notes) =>
    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId ? { ...b, notes } : b
      ),
    })),

  setCardVariant: (variant) => set({ cardVariant: variant }),
}));

export default useBookingStore;
