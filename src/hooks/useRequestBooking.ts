// src/hooks/useRequestBooking.ts
// Two places create a booking: the validated form on /bookings, and the quick
// "Book Session" button on the Sessions list. Rather than write the same
// useMutation twice, the write lives here -- the same reason useToggle and
// usePrevious exist.
//
// SESSION 7 wrote the mutation. SESSION 8 only changed what it is handed: the
// form now passes values Zod has already checked. GT4 PART 2 stops it
// inventing the owner, the status and the timestamp -- the API sets all three.
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiBooking, NewBooking } from "../types/index";
import { BookingStatus } from "../types/index";
import { createBooking, fetchBookings } from "../api/client";
import useAuthStore from "../store/authStore";

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
  const token = useAuthStore((state) => state.token);

  // Same key as the Bookings page, so this shares that page's cache entry and
  // costs no extra request when one has already been made. The Sessions page
  // is public, so without a token there is nothing to ask for -- the API
  // would only answer 401.
  const { data: bookings } = useQuery<ApiBooking[]>({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
    enabled: token !== null,
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
    if (token === null) {
      return "Log in first -- a booking belongs to an account.";
    }
    if (isAlreadyBooked(input.sessionId)) {
      return "You already have an active booking for this session.";
    }

    // Only what a tutee may set. Fields left undefined vanish in
    // JSON.stringify, so the quick button sends just the sessionId -- an
    // empty "" note would fail the schema's 10-character minimum.
    const newBooking: NewBooking = {
      sessionId: input.sessionId,
      notes: input.notes,
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
