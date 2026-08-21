// src/pages/SessionsPage.tsx
// SESSION 7: the list is fetched instead of imported, the search term moved out
// of useState into the UI store, and booking one really POSTs to the API.
import { useState } from "react";
import type { ChangeEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import type { ApiSession, ApiUser } from "../types/index";
import SessionCard from "../components/SessionCard";
import usePrevious from "../hooks/usePrevious";
import useRequestBooking from "../hooks/useRequestBooking";
import { fetchSessions, fetchTutors } from "../api/client";
import useUiStore from "../store/uiStore";

function SessionsPage() {
  // The banner is the only thing left that is genuinely local to this page.
  const [feedback, setFeedback] = useState<string>("");

  // The search box now reads and writes the store, not local state -- and the
  // useRef that used to autofocus it went with it.
  const searchTerm = useUiStore((state) => state.searchTerm);
  const setSearchTerm = useUiStore((state) => state.setSearchTerm);
  const cardVariant = useUiStore((state) => state.cardVariant);
  const previousSearch = usePrevious(searchTerm);

  const { data, isPending, isError, error } = useQuery<ApiSession[]>({
    queryKey: ["sessions"],
    queryFn: fetchSessions,
  });

  // The card wants a tutor NAME, and a session only carries a tutorId. Asking
  // for ["tutors"] here costs nothing: TutorsPage has usually already filled
  // that cache entry, and if not, both pages share this one request.
  const { data: tutors } = useQuery<ApiUser[]>({
    queryKey: ["tutors"],
    queryFn: fetchTutors,
  });

  const { requestBooking } = useRequestBooking();

  const getTutorName = (tutorId: string): string =>
    tutors?.find((t) => t.id === tutorId)?.name ?? "Unknown";

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const handleBookSession = (sessionId: string): void => {
    const message = requestBooking(sessionId);
    setFeedback(message);
    setTimeout(() => {
      setFeedback((current) => (current === message ? "" : current));
    }, 4000);
  };

  if (isPending) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((slot) => (
          <div
            key={slot}
            className="h-56 rounded-3xl border border-slate-200/60 bg-white/40 dark:border-slate-800/80 dark:bg-slate-900/30"
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

  // Derived value -- filter, never a second piece of state
  const filteredSessions = data.filter((s) =>
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
