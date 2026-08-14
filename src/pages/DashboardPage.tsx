// src/pages/DashboardPage.tsx
// The overview screen. GT2's 800ms fake-loading skeleton moves here, because
// this is the page that summarises everything.
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { allTutors, allSessions, currentTutee } from "../data/mockData";
import { BookingStatus } from "../types/index";
import useBookingStore from "../store/bookingStore";

function DashboardPage() {
  // Straight from GT2's App.tsx: a typed loading flag driven by useEffect
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const bookings = useBookingStore((state) => state.bookings);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer); // cleanup, so a fast navigation is safe
  }, []);

  // Derived counts -- recomputed on every render, never stored in state
  const activeBookings = bookings.filter(
    (b) => b.status !== BookingStatus.Cancelled
  ).length;

  if (isLoading) {
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

  const stats = [
    { label: "Tutors Available", value: allTutors.length, to: "/tutors", icon: "👥" },
    { label: "Sessions Scheduled", value: allSessions.length, to: "/sessions", icon: "📅" },
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
