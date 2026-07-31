import { useState, useEffect, useRef } from "react";
import type { ChangeEvent } from "react";
import TutorCard from "./components/TutorCard";
import SessionCard from "./components/SessionCard";
import BookingStatusCard from "./components/BookingStatusCard";
import type { TutoringUser, Session, Booking } from "./types/index";
import { BookingStatus } from "./types/index";
import useToggle from "./hooks/useToggle";
import usePrevious from "./hooks/usePrevious";
import "./App.css";

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
  // useState<T> -- T is the type of the state value
  const [selectedTutor, setSelectedTutor] = useState<TutoringUser | null>(null);

  // Array state -- starts empty, filled after "loading"
  const [tutors, setTutors] = useState<TutoringUser[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // The signed-in tutee -- object state, not a hard-coded JSX value
  const [currentTutee] = useState<TutoringUser>(mockTutee);

  // Boolean state -- tracks whether data has finished loading
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [feedback, setFeedback] = useState<string>("");

  // ===== TYPED DOM REFERENCE WITH useRef =====
  // useRef<T>(null) -- T is the DOM element type
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ===== TYPED DOM EVENTS INSIDE HOOKS =====
  const [searchTerm, setSearchTerm] = useState<string>("");

  // ===== CUSTOM HOOKS =====
  // useToggle -- tuple of [current value, toggle function]
  const [showDetails, toggleDetails] = useToggle(false);
  // usePrevious<T> -- T is inferred as string from searchTerm
  const previousSearch = usePrevious(searchTerm);

  // ===== LOADING MOCK DATA WITH useEffect =====
  // useEffect(fn, deps) -- fn runs after render;
  // an empty deps array [] means "run once, on mount"
  useEffect(() => {
    const timer = setTimeout(() => {
      // Reusing GT1's mock data as the "fetched" result
      setTutors(mockTutors);
      setSessions(mockSessions);
      setBookings(mockBookings);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // ChangeEvent<HTMLInputElement> types e.target as an <input>
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  // Focus the input programmatically (e.g. after loading finishes)
  const focusSearch = (): void => {
    searchInputRef.current?.focus();
  };

  // Once the "fetch" is done the input is mounted, so it can take focus
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
    console.log("Notes changed for Booking ID:", bookingId);
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

  // Derived value -- recomputed every render, not stored in state
  const filteredSessions = sessions.filter((s) =>
    s.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Early return -- render a placeholder until the "fetch" finishes
  if (isLoading) {
    return <p className="loading-message">Loading sessions...</p>;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Peer Booking Platform</h1>
        <p className="app-subtitle">ITELECT4 - GT2 PART 1</p>
      </header>

      {feedback && <div className="feedback-banner">{feedback}</div>}

      <main className="app-grid">
        {/* Section 1: Tutors */}
        <section className="app-section">
          <div className="section-header-area">
            <h2 className="section-title">
              <span>👥</span> Tutors Directory
            </h2>
            <span className="section-counter">{tutors.length} available</span>
          </div>
          <div className="cards-grid">
            {tutors.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} onSelect={handleSelectTutor} />
            ))}
          </div>
          {selectedTutor && (
            <div className="selection-preview">
              <h3>Currently Selected Tutor</h3>
              <p>
                <strong>{selectedTutor.name}</strong> ({selectedTutor.email})
              </p>
              {/* useToggle drives this collapsible detail panel */}
              <button type="button" className="toggle-button" onClick={toggleDetails}>
                {showDetails ? "Hide details" : "Show details"}
              </button>
              {showDetails && (
                <div className="tutor-details">
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

        {/* Section 2: Sessions */}
        <section className="app-section">
          <div className="section-header-area">
            <h2 className="section-title">
              <span>📅</span> Schedule a Session
            </h2>
            <span className="section-counter">{filteredSessions.length} sessions</span>
          </div>
          <input
            ref={searchInputRef}
            value={searchTerm}
            onChange={handleSearchChange}
            type="text"
            className="search-input"
            placeholder="Search sessions..."
          />
          {/* usePrevious remembers the search term from the last render */}
          {previousSearch !== undefined && previousSearch !== "" && previousSearch !== searchTerm && (
            <p className="previous-search">Previous search: "{previousSearch}"</p>
          )}
          <div className="cards-grid">
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => {
                  const tutor = tutors.find((t) => t.id === session.tutorId);
                return (
                  <SessionCard
                    key={session.id}
                    session={session}
                    tutorName={tutor ? tutor.name : "Unknown"}
                    onBook={handleBookSession}
                  />
                );
              })
            ) : (
              <p className="no-bookings">No sessions match "{searchTerm}".</p>
            )}
          </div>
        </section>

        {/* Section 3: Bookings */}
        <section className="app-section bookings-section">
          <div className="section-header-area">
            <h2 className="section-title">
              <span>📋</span> Booking Status ({currentTutee.name})
            </h2>
            <span className="section-counter">{bookings.length} total</span>
          </div>
          <div className="cards-grid">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <BookingStatusCard
                  key={booking.id}
                  booking={booking}
                  subjectName={getSessionSubject(booking.sessionId)}
                  tuteeName={currentTutee.name}
                  onCancel={handleCancelBooking}
                  onNotesChange={handleNotesChange}
                />
              ))
            ) : (
              <p className="no-bookings">No bookings created yet. Select a session to book!</p>
            )}
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>Built with React + TypeScript + Vite | AY 2026-2027</p>
      </footer>
    </div>
  );
}