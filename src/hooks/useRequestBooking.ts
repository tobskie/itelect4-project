// src/hooks/useRequestBooking.ts
// Two places create a booking: the validated form on /bookings, and the quick
// "Book Session" button on the Sessions list. Rather than write the same
// useMutation twice, the write lives here -- the same reason useToggle and
// usePrevious exist.
//
// SESSION 7 wrote the mutation. SESSION 8 only changed what it is handed: the
// form now passes values Zod has already checked.
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiBooking, NewBooking } from "../types/index";
import { BookingStatus } from "../types/index";
import { createBooking, fetchBookings } from "../api/client";
import { currentTutee } from "../data/mockData";

// Everything the form collects, plus the shorter version the quick button
// sends. contactEmail and preferredDate are optional here because the button
// has no fields to collect them from.
export interface BookingRequestInput {
  sessionId: string;
  notes?: string;
  contactEmail?: string;
  preferredDate?: string;
}

interface UseRequestBookingOptions {
  // The page decides what "it worked" means -- clearing the form, in the
  // form's case. The hook does not know the form exists.
  onSaved?: () => void;
}

function useRequestBooking(options: UseRequestBookingOptions = {}) {
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
      options.onSaved?.();
    },
  });

  // The duplicate guard, checked against server data rather than a local array.
  const isAlreadyBooked = (sessionId: string): boolean =>
    (bookings ?? []).some(
      (b) => b.sessionId === sessionId && b.status !== BookingStatus.Cancelled
    );

  // Returns the message the page shows in its banner.
  const requestBooking = (input: BookingRequestInput): string => {
    if (isAlreadyBooked(input.sessionId)) {
      return "You already have an active booking for this session.";
    }

    const newBooking: NewBooking = {
      sessionId: input.sessionId,
      tuteeId: currentTutee.id,
      status: BookingStatus.Requested,
      requestedAt: new Date().toISOString(), // a STRING, not a Date
      notes: input.notes ?? "",
      contactEmail: input.contactEmail,
      preferredDate: input.preferredDate,
    };

    // mutate() is fire-and-forget: it does not return the saved row. That
    // arrives in onSuccess, or on mutation.data a few renders later.
    mutation.mutate(newBooking);
    return "Booking requested. Check the Bookings page for its status.";
  };

  return {
    requestBooking,
    isAlreadyBooked,
    isSaving: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}

export default useRequestBooking;
