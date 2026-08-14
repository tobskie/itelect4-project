// src/pages/SessionsPage.tsx
// GT2's "Sessions Schedule" column: the search box, the useRef autofocus and
// the usePrevious hint all move here unchanged.
import { useState, useEffect, useRef } from "react";
import type { ChangeEvent } from "react";
import { Link } from "react-router";
import SessionCard from "../components/SessionCard";
import usePrevious from "../hooks/usePrevious";
import { allSessions, getTutorName } from "../data/mockData";
import useBookingStore from "../store/bookingStore";

function SessionsPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");

  // A typed DOM reference -- null until React attaches the input
  const searchInputRef = useRef<HTMLInputElement>(null);
  const previousSearch = usePrevious(searchTerm);

  const cardVariant = useBookingStore((state) => state.cardVariant);
  const requestBooking = useBookingStore((state) => state.requestBooking);

  // Focus the search box as soon as the page mounts
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  // The store does the duplicate check and hands back the message to show
  const handleBookSession = (sessionId: number): void => {
    const message = requestBooking(sessionId);
    setFeedback(message);
    setTimeout(() => {
      setFeedback((current) => (current === message ? "" : current));
    }, 4000);
  };

  // Derived value -- filter, never a second piece of state
  const filteredSessions = allSessions.filter((s) =>
    s.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {feedback && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 rounded-2xl border border-indigo-200 bg-indigo-50/95 dark:bg-indigo-950/90 dark:border-indigo-900/35 px-4 py-3 text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-lg backdrop-blur-md">
          <span className="text-sm">🔔</span>
          {feedback}
          <Link to="/bookings" className="underline">
            View bookings
          </Link>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
          <span className="text-xl">📅</span> Sessions Schedule
        </h2>
        <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
          {filteredSessions.length} total
        </span>
      </div>

      <div className="relative max-w-md">
        <input
          ref={searchInputRef}
          value={searchTerm}
          onChange={handleSearchChange}
          type="text"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500 transition-all duration-200 shadow-sm"
          placeholder="Search sessions by subject..."
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 text-xs font-semibold cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* usePrevious remembers the search term from the render before this one */}
      {previousSearch !== undefined &&
        previousSearch !== "" &&
        previousSearch !== searchTerm && (
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
            Previous search: <span className="italic">"{previousSearch}"</span>
          </p>
        )}

      {filteredSessions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              tutorName={getTutorName(session.tutorId)}
              onBook={handleBookSession}
              variant={cardVariant}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center">
          <span className="text-3xl mb-2.5">🔍</span>
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No sessions match query
          </h4>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-[220px]">
            No schedules found for "{searchTerm}". Try another search term.
          </p>
          <button
            onClick={() => setSearchTerm("")}
            className="mt-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 px-4 py-2 text-xs font-semibold transition-colors duration-200 cursor-pointer"
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  );
}

export default SessionsPage;
