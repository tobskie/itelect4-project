// src/pages/BookingsPage.tsx
// GT2's "Booking Status" column. This is the page behind ProtectedRoute --
// your bookings are yours, so you have to be signed in to see them.
import { Link } from "react-router";
import BookingStatusCard from "../components/BookingStatusCard";
import { currentTutee, getSessionSubject } from "../data/mockData";
import useBookingStore from "../store/bookingStore";
import useAuthStore from "../store/authStore";

function BookingsPage() {
  const bookings = useBookingStore((state) => state.bookings);
  const cancelBooking = useBookingStore((state) => state.cancelBooking);
  const updateNotes = useBookingStore((state) => state.updateNotes);
  const cardVariant = useBookingStore((state) => state.cardVariant);

  // ProtectedRoute guarantees there is a token, so this name is always set
  const userName = useAuthStore((state) => state.userName);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
          <span className="text-xl">📋</span> Booking Status
        </h2>
        <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
          {bookings.length} total
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

      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <BookingStatusCard
              key={booking.id}
              booking={booking}
              subjectName={getSessionSubject(booking.sessionId)}
              tuteeName={userName ?? currentTutee.name}
              onCancel={cancelBooking}
              onNotesChange={updateNotes}
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
