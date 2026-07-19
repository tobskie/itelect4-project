import { useState } from "react";
import TutorCard from "./components/TutorCard";
import SessionCard from "./components/SessionCard";
import BookingStatusCard from "./components/BookingStatusCard";
import type { TutoringUser, Session, Booking } from "./types/index";
import { BookingStatus } from "./types/index";
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

export default function App() {
  const [selectedTutor, setSelectedTutor] = useState<TutoringUser | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([
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
    }
  ]);
  const [feedback, setFeedback] = useState<string>("");

  const handleSelectTutor = (tutor: TutoringUser): void => {
    setSelectedTutor(tutor);
    showFeedback(`Selected Tutor Profile: ${tutor.name}`);
  };

  const handleBookSession = (sessionId: number): void => {
    const session = mockSessions.find((s) => s.id === sessionId);
    if (!session) return;

    if (bookings.some((b) => b.sessionId === sessionId && b.status !== BookingStatus.Cancelled)) {
      showFeedback(`You already have an active booking for this session.`);
      return;
    }

    const newBooking: Booking = {
      id: Date.now(),
      sessionId: session.id,
      tuteeId: mockTutee.id,
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
    const session = mockSessions.find((s) => s.id === sessionId);
    return session ? session.subject : "Unknown";
  };

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
            <span className="section-counter">{mockTutors.length} available</span>
          </div>
          <div className="cards-grid">
            {mockTutors.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} onSelect={handleSelectTutor} />
            ))}
          </div>
          {selectedTutor && (
            <div className="selection-preview">
              <h3>Currently Selected Tutor</h3>
              <p>
                <strong>{selectedTutor.name}</strong> ({selectedTutor.email})
              </p>
            </div>
          )}
        </section>

        {/* Section 2: Sessions */}
        <section className="app-section">
          <div className="section-header-area">
            <h2 className="section-title">
              <span>📅</span> Schedule a Session
            </h2>
            <span className="section-counter">{mockSessions.length} sessions</span>
          </div>
          <div className="cards-grid">
            {mockSessions.map((session) => {
              const tutor = mockTutors.find((t) => t.id === session.tutorId);
              return (
                <SessionCard
                  key={session.id}
                  session={session}
                  tutorName={tutor ? tutor.name : "Unknown"}
                  onBook={handleBookSession}
                />
              );
            })}
          </div>
        </section>

        {/* Section 3: Bookings */}
        <section className="app-section bookings-section">
          <div className="section-header-area">
            <h2 className="section-title">
              <span>📋</span> Booking Status ({mockTutee.name})
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
                  tuteeName={mockTutee.name}
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