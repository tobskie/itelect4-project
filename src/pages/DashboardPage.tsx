// src/pages/DashboardPage.tsx
// The overview screen.
// SESSION 7: GT2's 800ms fake-loading setTimeout is GONE. The skeleton is now
// driven by three real requests -- and because all three keys are shared with
// the pages below, arriving here warms their caches for free.
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import type { ApiBooking, ApiSession, ApiUser } from "../types/index";
import { BookingStatus } from "../types/index";
import { currentTutee } from "../data/mockData";
import { fetchTutors, fetchSessions, fetchBookings } from "../api/client";

function DashboardPage() {
  const tutors = useQuery<ApiUser[]>({
    queryKey: ["tutors"],
    queryFn: fetchTutors,
  });
  const sessions = useQuery<ApiSession[]>({
    queryKey: ["sessions"],
    queryFn: fetchSessions,
  });
  const bookings = useQuery<ApiBooking[]>({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
  });

  // isPending means "no data yet, ever" -- not the same as isFetching, which is
  // also true during a background refresh while old data is still on screen.
  const isPending =
    tutors.isPending || sessions.isPending || bookings.isPending;
  const isError = tutors.isError || sessions.isError || bookings.isError;

  if (isPending) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((col) => (
          <div
            key={col}
            className="h-32 rounded-3xl border border-slate-200/60 bg-white/40 dark:border-slate-800/80 dark:bg-slate-900/30"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/20 p-5">
        <h2 className="text-sm font-bold text-red-700 dark:text-red-400">
          Could not reach the API.
        </h2>
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
          Is json-server running on port 3001? Start it with{" "}
          <code className="font-mono">npm run api</code>.
        </p>
      </div>
    );
  }

  // Derived counts -- recomputed on every render, never stored in state
  const activeBookings = bookings.data.filter(
    (b) => b.status !== BookingStatus.Cancelled
  ).length;

  const stats = [
    { label: "Tutors Available", value: tutors.data.length, to: "/tutors", icon: "👥" },
    { label: "Sessions Scheduled", value: sessions.data.length, to: "/sessions", icon: "📅" },
    { label: "Active Bookings", value: activeBookings, to: "/bookings", icon: "📋" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          Dashboard
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Signed in as {currentTutee.name} ({currentTutee.role})
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat) => (
          // <Link> renders a real <a>, so middle-click and "open in new tab" work
          <Link
            key={stat.label}
            to={stat.to}
            className="flex flex-col gap-2 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/20 backdrop-blur-md p-6 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors duration-200"
          >
            <span className="text-2xl">{stat.icon}</span>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-50">
              {stat.value}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {stat.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
