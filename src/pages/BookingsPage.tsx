// src/pages/BookingsPage.tsx
// The page behind ProtectedRoute -- your bookings are yours, so you have to be
// signed in to see them.
// SESSION 7: the list is read with useQuery, and cancelling or annotating a
// booking is a real PATCH that invalidates that same key when it succeeds.
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import type { ApiBooking, ApiSession, BookingPatch } from "../types/index";
import { BookingStatus } from "../types/index";
import BookingStatusCard from "../components/BookingStatusCard";
import { currentTutee } from "../data/mockData";
import { fetchBookings, fetchSessions, updateBooking } from "../api/client";
import useAuthStore from "../store/authStore";
import useUiStore from "../store/uiStore";

function BookingsPage() {
  const queryClient = useQueryClient();
  const cardVariant = useUiStore((state) => state.cardVariant);

  // ProtectedRoute guarantees there is a token, so this name is always set
  const userName = useAuthStore((state) => state.userName);

  // 1. READ
  const { data, isPending, isError, error } = useQuery<ApiBooking[]>({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
  });

  // A booking stores a sessionId; the card wants a subject to print. Same key
  // as SessionsPage, so this reuses that cache entry rather than refetching.
  const { data: sessions } = useQuery<ApiSession[]>({
    queryKey: ["sessions"],
    queryFn: fetchSessions,
  });

  // 2. WRITE -- one mutation covers both edits, because both are a PATCH of a
  // few fields on one booking. mutationFn takes exactly one argument, so the
  // id and the patch travel together in a single object.
  const editBooking = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: BookingPatch }) =>
      updateBooking(id, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  const getSessionSubject = (sessionId: string): string =>
    sessions?.find((s) => s.id === sessionId)?.subject ?? "Unknown";

  const handleCancel = (bookingId: string): void => {
    editBooking.mutate({
      id: bookingId,
      patch: { status: BookingStatus.Cancelled },
    });
  };

  const handleNotesChange = (bookingId: string, notes: string): void => {
    editBooking.mutate({ id: bookingId, patch: { notes } });
  };

  if (isPending) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2].map((slot) => (
          <div
            key={slot}
            className="h-52 rounded-3xl border border-slate-200/60 bg-white/40 dark:border-slate-800/80 dark:bg-slate-900/30"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/20 p-5">
        <h2 className="text-sm font-bold text-red-700 dark:text-red-400">
          {error.message}
        </h2>
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
          Is json-server running on port 3001? Start it with{" "}
          <code className="font-mono">npm run api</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
          <span className="text-xl">📋</span> Booking Status
        </h2>
        <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
          {data.length} total
        </span>
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-indigo-50/40 border border-indigo-100/50 p-3.5 dark:bg-indigo-950/10 dark:border-indigo-900/30 max-w-sm">
        <div className="h-8 w-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
          {(userName ?? currentTutee.name).charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Signed In As
          </p>
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-50">
            {userName ?? currentTutee.name} ({currentTutee.role})
          </h4>
        </div>
      </div>

      {/* A failed PATCH leaves the list exactly as it was, so say so. */}
      {editBooking.isError && (
        <p className="text-xs font-semibold text-red-700 dark:text-red-400">
          {editBooking.error.message}
        </p>
      )}

      {data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((booking) => (
            <BookingStatusCard
              key={booking.id}
              booking={booking}
              subjectName={getSessionSubject(booking.sessionId)}
              tuteeName={userName ?? currentTutee.name}
              onCancel={handleCancel}
              onNotesChange={handleNotesChange}
              variant={cardVariant}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center">
          <span className="text-3xl mb-2.5">📋</span>
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No Bookings Yet
          </h4>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-[220px]">
            You have not requested any tutoring sessions.
          </p>
          <Link
            to="/sessions"
            className="mt-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-semibold text-white transition-colors duration-200"
          >
            Browse Sessions
          </Link>
        </div>
      )}
    </div>
  );
}

export default BookingsPage;
