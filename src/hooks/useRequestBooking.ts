// src/hooks/useRequestBooking.ts -- a NEW file
// Two pages let you book a session: the Sessions list and a tutor's detail
// page. Rather than write the same useMutation twice, the write lives here --
// the same reason useToggle and usePrevious exist.
//
// This is the POST half of Session 7: mutationFn does the write, and onSuccess
// invalidates the key the new row belongs to.
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiBooking, NewBooking } from "../types/index";
import { BookingStatus } from "../types/index";
import { createBooking, fetchBookings } from "../api/client";
import { currentTutee } from "../data/mockData";

function useRequestBooking() {
  const queryClient = useQueryClient();

  // Same key as the Bookings page, so this shares that page's cache entry and
  // costs no extra request when one has already been made.
  const { data: bookings } = useQuery<ApiBooking[]>({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
  });

  const mutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      // "the bookings list is out of date now -- go and refetch it".
      // This does NOT fetch: it marks the entry stale, and Query refetches it
      // because a mounted component is using that key.
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  // Returns the message the page shows in its feedback banner -- the same
  // duplicate guard the GT2 store had, now checked against server data.
  const requestBooking = (sessionId: string): string => {
    const alreadyBooked = (bookings ?? []).some(
      (b) => b.sessionId === sessionId && b.status !== BookingStatus.Cancelled
    );
    if (alreadyBooked) {
      return "You already have an active booking for this session.";
    }

    const newBooking: NewBooking = {
      sessionId,
      tuteeId: currentTutee.id,
      status: BookingStatus.Requested,
      requestedAt: new Date().toISOString(), // a STRING, not a Date
      notes: "",
    };

    // mutate() is fire-and-forget: it does not return the saved row. That
    // arrives in onSuccess, or on mutation.data a few renders later.
    mutation.mutate(newBooking);
    return "Booking requested. Check the Bookings page for its status.";
  };

  return {
    requestBooking,
    isSaving: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}

export default useRequestBooking;
