// src/components/Layout.tsx
// The frame every page renders inside: the header, the nav bar, the global
// controls, and the <Outlet /> hole the matched child route fills.
import { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router";
import useAuthStore from "../store/authStore";
import useBookingStore from "../store/bookingStore";

function Layout() {
  // Dark mode MOVES here, out of GT2's App.tsx, so every page inherits it
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return (
        document.documentElement.classList.contains("dark") ||
        localStorage.getItem("theme") === "dark"
      );
    }
    return false;
  });

  // Sync the state with the <html> class, which is what Tailwind's dark:
  // variant looks for -- see @custom-variant dark in src/index.css
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Read only what this component needs out of each store
  const userName = useAuthStore((state) => state.userName);
  const logout = useAuthStore((state) => state.logout);
  const cardVariant = useBookingStore((state) => state.cardVariant);
  const setCardVariant = useBookingStore((state) => state.setCardVariant);

  // The classes every nav link shares, then the two variants
  const base =
    "rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors duration-200 cursor-pointer";
  const activeLink = `${base} bg-indigo-600 text-white shadow-sm`;
  const idleLink = `${base} text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100`;

  // NavLink hands this function an isActive flag on every render
  const linkClass = ({ isActive }: { isActive: boolean }): string =>
    isActive ? activeLink : idleLink;

  // The density toggle used to sit in the GT2 header; it now drives the store
  const variantButton = (variant: "default" | "compact"): string =>
    `rounded-lg px-3 py-1.5 transition-all duration-200 cursor-pointer ${
      cardVariant === variant
        ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400"
        : "hover:text-slate-900 dark:hover:text-slate-200"
    }`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8">
        <header className="flex flex-col gap-6 pb-6 border-b border-slate-200/60 dark:border-slate-800/80">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
                Peer Booking Platform
              </h1>
              <p className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mt-1">
                ITELECT4 - GT3 PART 1
              </p>
            </div>

            {/* Global Action Panel */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <button
                  onClick={() => setCardVariant("default")}
                  className={variantButton("default")}
                >
                  Default View
                </button>
                <button
                  onClick={() => setCardVariant("compact")}
                  className={variantButton("compact")}
                >
                  Compact View
                </button>
              </div>

              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                aria-label="Toggle theme"
                className="flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-white hover:bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/50 transition-all duration-200 cursor-pointer shadow-sm"
              >
                <span className="text-lg">{isDarkMode ? "☀️" : "🌙"}</span>
              </button>
            </div>
          </div>

          {/* THE SHARED NAV -- on every page, and it never reloads the app */}
          <nav className="flex flex-wrap items-center gap-2">
            {/* `end` makes this match ONLY "/", not every URL starting with it */}
            <NavLink to="/" end className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/tutors" className={linkClass}>
              Tutors
            </NavLink>
            <NavLink to="/sessions" className={linkClass}>
              Sessions
            </NavLink>
            <NavLink to="/bookings" className={linkClass}>
              Bookings
            </NavLink>

            <div className="ml-auto flex items-center gap-2">
              {userName === null ? (
                <NavLink to="/login" className={linkClass}>
                  Login
                </NavLink>
              ) : (
                <button
                  onClick={logout}
                  className={`${base} border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800`}
                >
                  Logout ({userName})
                </button>
              )}
            </div>
          </nav>
        </header>

        <main>
          <Outlet /> {/* <-- THE HOLE the matched child route fills */}
        </main>

        <footer className="mt-8 border-t border-slate-200/50 dark:border-slate-800/60 pt-6 text-center text-xs text-slate-400 dark:text-slate-500">
          <p>Built with React + TypeScript + Vite + Tailwind CSS v4 | AY 2026-2027</p>
        </footer>
      </div>
    </div>
  );
}

export default Layout;
