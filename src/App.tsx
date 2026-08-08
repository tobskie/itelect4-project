import { useState, useEffect, useRef } from "react";
import type { ChangeEvent } from "react";
import TutorCard from "./components/TutorCard";
import SessionCard from "./components/SessionCard";
import BookingStatusCard from "./components/BookingStatusCard";
import type { TutoringUser, Session, Booking } from "./types/index";
import { BookingStatus } from "./types/index";
import useToggle from "./hooks/useToggle";
import usePrevious from "./hooks/usePrevious";

// Mock Tutors
const mockTutors: TutoringUser[] = [
  {
    id: 1,
    name: "Toby Olimpo",
    email: "tobster@example.com",
    role: "tutor",
    isActive: true,
    bio: "4th yr BSIT Student. magaling sya, oo hehehe.",
    subjects: ["ITELECT4", "Data Structures", "Next.js"],
  },
  {
    id: 2,
    name: "Rio Amor",
    email: "rioamor@example.com",
    role: "tutor",
    isActive: false,
    bio: "3rd yr BSIT Student. magaling din sya",
    subjects: ["ITELECT4", "Data Structures", "Next.js"],
  },
];

// Mock Tutee
const mockTutee: TutoringUser = {
  id: 3,
  name: "Anton Olimpo",
  email: "antonolimpo@example.com",
  role: "tutee",
  isActive: true,
};

// Mock Sessions
const mockSessions: Session[] = [
  {
    id: 101,
    tutorId: 1,
    subject: "ITELECT4",
    description: "Vite + React + TS Component Scaffolding Lab",
    scheduledAt: new Date("2026-07-20T14:00:00"),
    durationMinutes: 60,
    maxSlots: 3,
  },
  {
    id: 102,
    tutorId: 2,
    subject: "Calculus",
    description: "Integration Techniques & Practical Review",
    scheduledAt: new Date("2026-07-22T09:30:00"),
    durationMinutes: 90,
    maxSlots: 5,
  },
];

// Mock Bookings
const mockBookings: Booking[] = [
  {
    id: 201,
    sessionId: 101,
    tuteeId: 3,
    status: BookingStatus.Requested,
    requestedAt: new Date(),
    notes: "Please cover React component props typing.",
  },
  {
    id: 202,
    sessionId: 102,
    tuteeId: 3,
    status: BookingStatus.Confirmed,
    requestedAt: new Date(),
    notes: "Need help with trig integration.",
  },
];

export default function App() {
  // ===== TYPED STATE WITH useState<T> =====
  const [selectedTutor, setSelectedTutor] = useState<TutoringUser | null>(null);
  const [tutors, setTutors] = useState<TutoringUser[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentTutee] = useState<TutoringUser>(mockTutee);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<string>("");

  // ===== TAILWIND V4 DARK MODE & VARIANT STATE =====
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark") ||
        localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  const [cardVariant, setCardVariant] = useState<"default" | "compact">("default");

  // Sync Dark Mode state with document class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // ===== TYPED DOM REFERENCE WITH useRef =====
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ===== TYPED DOM EVENTS INSIDE HOOKS =====
  const [searchTerm, setSearchTerm] = useState<string>("");

  // ===== CUSTOM HOOKS =====
  const [showDetails, toggleDetails] = useToggle(false);
  const previousSearch = usePrevious(searchTerm);

  // ===== LOADING MOCK DATA WITH useEffect =====
  useEffect(() => {
    const timer = setTimeout(() => {
      setTutors(mockTutors);
      setSessions(mockSessions);
      setBookings(mockBookings);
      setIsLoading(false);
    }, 800); // 800ms loading to show off skeleton transition
    return () => clearTimeout(timer);
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const focusSearch = (): void => {
    searchInputRef.current?.focus();
  };

  useEffect(() => {
    if (!isLoading) {
      focusSearch();
    }
  }, [isLoading]);

  const handleSelectTutor = (tutor: TutoringUser): void => {
    setSelectedTutor(tutor);
    showFeedback(`Selected Tutor Profile: ${tutor.name}`);
  };

  const handleBookSession = (sessionId: number): void => {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return;

    if (bookings.some((b) => b.sessionId === sessionId && b.status !== BookingStatus.Cancelled)) {
      showFeedback(`You already have an active booking for this session.`);
      return;
    }

    const newBooking: Booking = {
      id: Date.now(),
      sessionId: session.id,
      tuteeId: currentTutee.id,
      status: BookingStatus.Requested,
      requestedAt: new Date(),
      notes: "",
    };

    setBookings((prev) => [...prev, newBooking]);
    showFeedback(`Successfully requested booking for ${session.subject}!`);
  };

  const handleCancelBooking = (bookingId: number): void => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: BookingStatus.Cancelled } : b))
    );
    showFeedback(`Booking #${bookingId} has been cancelled.`);
  };

  const handleNotesChange = (bookingId: number, nextNotes: string): void => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, notes: nextNotes } : b))
    );
  };

  const showFeedback = (msg: string): void => {
    setFeedback(msg);
    setTimeout(() => {
      setFeedback((current) => (current === msg ? "" : current));
    }, 4000);
  };

  const getSessionSubject = (sessionId: number): string => {
    const session = sessions.find((s) => s.id === sessionId);
    return session ? session.subject : "Unknown";
  };

  // Derived value
  const filteredSessions = sessions.filter((s) =>
    s.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ===== PREMIUM SKELETON LOADING STATE =====
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col gap-8 min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
        <header className="flex flex-col items-center justify-center gap-3 pb-8 border-b border-slate-200/60 dark:border-slate-800/80 animate-pulse">
          <div className="h-9 w-64 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="h-4 w-40 bg-slate-100 dark:bg-slate-900 rounded-lg"></div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((col) => (
            <div 
              key={col} 
              className={`flex flex-col gap-5 p-6 rounded-3xl border border-slate-200/60 bg-white/40 dark:border-slate-800/80 dark:bg-slate-900/30 animate-pulse ${
                col === 3 ? "col-span-1 sm:col-span-2 lg:col-span-1" : "col-span-1"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="h-6 w-36 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
                <div className="h-5 w-16 bg-slate-150 dark:bg-slate-855 rounded-full"></div>
              </div>
              <div className="h-28 bg-slate-100 dark:bg-slate-900/60 rounded-2xl"></div>
              <div className="h-28 bg-slate-100 dark:bg-slate-900/60 rounded-2xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8">
      
      {/* HEADER SECTION WITH ADVANCED CONTROLS */}
      <header className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-slate-200/60 dark:border-slate-800/80">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 transition-colors duration-300 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
            Peer Booking Platform
          </h1>
          <p className="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mt-1">
            ITELECT4 - GT2 FINAL
          </p>
        </div>

        {/* Global Action Panel */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Card Layout Selector */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <button
              onClick={() => setCardVariant("default")}
              className={`rounded-lg px-3 py-1.5 transition-all duration-200 cursor-pointer ${
                cardVariant === "default"
                  ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400"
                  : "hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Default View
            </button>
            <button
              onClick={() => setCardVariant("compact")}
              className={`rounded-lg px-3 py-1.5 transition-all duration-200 cursor-pointer ${
                cardVariant === "compact"
                  ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400"
                  : "hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Compact View
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label="Toggle theme"
            className="flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-white hover:bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/50 transition-all duration-200 cursor-pointer shadow-sm"
          >
            {isDarkMode ? (
              <span className="text-lg">☀️</span>
            ) : (
              <span className="text-lg">🌙</span>
            )}
          </button>
        </div>
      </header>

      {/* FEEDBACK FLOATING BANNER */}
      {feedback && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 rounded-2xl border border-indigo-150 bg-indigo-50/95 dark:bg-indigo-950/90 dark:border-indigo-900/35 px-4.5 py-3 text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-lg backdrop-blur-md animate-bounce">
          <span className="text-sm">🔔</span>
          {feedback}
        </div>
      )}

      {/* THREE-COLUMN RESPONSIVE LAYOUT DASHBOARD */}
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* SECTION 1: TUTORS */}
        <section className="flex flex-col rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/20 backdrop-blur-md p-6 shadow-sm transition-colors duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
              <span className="text-xl">👥</span> Tutors Directory
            </h2>
            <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
              {tutors.length} available
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {tutors.map((tutor) => (
              <TutorCard 
                key={tutor.id} 
                tutor={tutor} 
                onSelect={handleSelectTutor} 
                variant={cardVariant}
              />
            ))}
          </div>

          {selectedTutor && (
            <div className="mt-6 p-5 rounded-2xl border border-indigo-100 bg-indigo-50/30 dark:border-indigo-950/40 dark:bg-indigo-950/10">
              <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Currently Selected Tutor
              </h3>
              <p className="mt-1.5 text-sm font-semibold text-slate-950 dark:text-slate-50">
                {selectedTutor.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {selectedTutor.email}
              </p>
              
              {/* Collapsible detail panel */}
              <button 
                type="button" 
                className="mt-3.5 inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors duration-200 cursor-pointer shadow-sm"
                onClick={toggleDetails}
              >
                {showDetails ? "Hide Bio & Subjects" : "View Bio & Subjects"}
              </button>

              {showDetails && (
                <div className="mt-4 border-t border-indigo-100/50 dark:border-indigo-950/50 pt-3 text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
                  <p>{selectedTutor.bio ?? "No bio provided."}</p>
                  <p>
                    <strong>Subjects:</strong>{" "}
                    {selectedTutor.subjects?.join(", ") ?? "None listed"}
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* SECTION 2: SESSIONS */}
        <section className="flex flex-col rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/20 backdrop-blur-md p-6 shadow-sm transition-colors duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
              <span className="text-xl">📅</span> Sessions Schedule
            </h2>
            <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
              {filteredSessions.length} total
            </span>
          </div>

          <div className="mb-5 relative">
            <input
              ref={searchInputRef}
              value={searchTerm}
              onChange={handleSearchChange}
              type="text"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-850 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500 transition-all duration-200 shadow-sm"
              placeholder="Search sessions by subject..."
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 text-xs font-semibold"
              >
                Clear
              </button>
            )}
          </div>

          {/* usePrevious remembers search state */}
          {previousSearch !== undefined && previousSearch !== "" && previousSearch !== searchTerm && (
            <p className="mb-4 text-xs font-medium text-slate-400 dark:text-slate-500">
              Previous search: <span className="italic">"{previousSearch}"</span>
            </p>
          )}

          <div className="flex flex-col gap-4">
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => {
                const tutor = tutors.find((t) => t.id === session.tutorId);
                return (
                  <SessionCard
                    key={session.id}
                    session={session}
                    tutorName={tutor ? tutor.name : "Unknown"}
                    onBook={handleBookSession}
                    variant={cardVariant}
                  />
                );
              })
            ) : (
              /* PREMIUM STYLED ERROR/EMPTY STATE */
              <div className="flex flex-col items-center justify-center py-10 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center">
                <span className="text-3xl mb-2.5">🔍</span>
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-350">No sessions match query</h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-[200px]">
                  No schedules found for "{searchTerm}". Try another search term.
                </p>
                <button 
                  onClick={() => setSearchTerm("")}
                  className="mt-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-250 px-4 py-2 text-xs font-semibold transition-colors duration-250 cursor-pointer"
                >
                  Reset Filter
                </button>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 3: BOOKINGS */}
        <section className="col-span-1 sm:col-span-2 lg:col-span-1 flex flex-col rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/20 backdrop-blur-md p-6 shadow-sm transition-colors duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
              <span className="text-xl">📋</span> Booking Status
            </h2>
            <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
              {bookings.length} total
            </span>
          </div>

          {/* Current Tutee mini banner */}
          <div className="mb-5 flex items-center gap-3 rounded-2xl bg-indigo-50/40 border border-indigo-100/50 p-3.5 dark:bg-indigo-950/10 dark:border-indigo-900/30">
            <div className="h-8 w-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
              {currentTutee.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Signed In As</p>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-50">{currentTutee.name} ({currentTutee.role})</h4>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <BookingStatusCard
                  key={booking.id}
                  booking={booking}
                  subjectName={getSessionSubject(booking.sessionId)}
                  tuteeName={currentTutee.name}
                  onCancel={handleCancelBooking}
                  onNotesChange={handleNotesChange}
                  variant={cardVariant}
                />
              ))
            ) : (
              /* EMPTY STATE FOR BOOKINGS */
              <div className="flex flex-col items-center justify-center py-10 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center">
                <span className="text-3xl mb-2.5">📋</span>
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-350">No Bookings Yet</h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-[200px]">
                  You have not requested any tutoring sessions. Select a session to get started!
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-8 border-t border-slate-200/50 dark:border-slate-800/60 pt-6 text-center text-xs text-slate-400 dark:text-slate-500">
        <p>Built with React + TypeScript + Vite + Tailwind CSS v4 | AY 2026-2027</p>
      </footer>
      </div>
    </div>
  );
}