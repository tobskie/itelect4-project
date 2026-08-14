// src/pages/TutorDetailPage.tsx
// The route with a URL parameter: /tutors/:tutorId
import { useParams, useNavigate, Link } from "react-router";
import useToggle from "../hooks/useToggle";
import SessionCard from "../components/SessionCard";
import { allTutors, allSessions } from "../data/mockData";
import useBookingStore from "../store/bookingStore";

function TutorDetailPage() {
  // Reads whatever sits in the :tutorId slot of the URL. The key `tutorId`
  // must match the :tutorId in the route path exactly, or this is undefined.
  const { tutorId } = useParams<{ tutorId: string }>();
  const navigate = useNavigate();

  // GT2's collapsible bio panel, unchanged
  const [showDetails, toggleDetails] = useToggle(false);
  const cardVariant = useBookingStore((state) => state.cardVariant);
  const requestBooking = useBookingStore((state) => state.requestBooking);

  // The URL is user input -- they can type anything, so tutorId is
  // string | undefined no matter what we told TypeScript it was.
  const tutor = allTutors.find((t) => t.id === Number(tutorId));

  if (tutor === undefined) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/20 p-5">
        <h2 className="text-sm font-bold text-red-700 dark:text-red-400">
          No tutor found with id "{tutorId}".
        </h2>
        <Link
          to="/tutors"
          className="mt-2 inline-block text-xs font-semibold text-red-600 dark:text-red-400 underline"
        >
          Back to the Tutors Directory
        </Link>
      </div>
    );
  }

  // Only the sessions this tutor offers
  const tutorSessions = allSessions.filter((s) => s.tutorId === tutor.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/20 backdrop-blur-md p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-lg">
            {tutor.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {tutor.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {tutor.email} &middot; {tutor.isActive ? "Active" : "Inactive"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleDetails}
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors duration-200 cursor-pointer shadow-sm"
        >
          {showDetails ? "Hide Bio & Subjects" : "View Bio & Subjects"}
        </button>

        {showDetails && (
          <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
            <p>{tutor.bio ?? "No bio provided."}</p>
            <p>
              <strong>Subjects:</strong>{" "}
              {tutor.subjects?.join(", ") ?? "None listed"}
            </p>
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Sessions by {tutor.name}
        </h3>
        {tutorSessions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {tutorSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                tutorName={tutor.name}
                onBook={requestBooking}
                variant={cardVariant}
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 dark:text-slate-500">
            This tutor has no scheduled sessions yet.
          </p>
        )}
      </div>

      {/* useNavigate() again, from a click handler */}
      <button
        onClick={() => navigate("/tutors")}
        className="self-start rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors duration-200 cursor-pointer"
      >
        Back to Tutors
      </button>
    </div>
  );
}

export default TutorDetailPage;
