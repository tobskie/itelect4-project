// src/pages/TutorDetailPage.tsx
// The route with a URL parameter: /tutors/:tutorId
// SESSION 7: that parameter now goes INTO the query key, so every tutor gets a
// cache entry of their own instead of overwriting one shared box.
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate, Link } from "react-router";
import type { ApiSession, ApiUser } from "../types/index";
import useToggle from "../hooks/useToggle";
import useRequestBooking from "../hooks/useRequestBooking";
import SessionCard from "../components/SessionCard";
import { fetchTutorById, fetchSessions } from "../api/client";
import useUiStore from "../store/uiStore";

function TutorDetailPage() {
  // Reads whatever sits in the :tutorId slot of the URL. The key `tutorId`
  // must match the :tutorId in the route path exactly, or this is undefined.
  const { tutorId } = useParams<{ tutorId: string }>();
  const navigate = useNavigate();

  // GT2's collapsible bio panel, unchanged
  const [showDetails, toggleDetails] = useToggle(false);
  const cardVariant = useUiStore((state) => state.cardVariant);
  const { requestBooking } = useRequestBooking();

  // ["tutors", tutorId] -- the same first element as the list, plus the thing
  // that makes this one different. Leave tutorId out of the key and every tutor
  // you visit would overwrite the last one in the cache: silent, and it looks
  // exactly like a caching bug.
  const {
    data: tutor,
    isPending,
    isError,
    error,
  } = useQuery<ApiUser>({
    queryKey: ["tutors", tutorId],
    // An arrow function, because we need to pass an argument. Writing
    // `queryFn: fetchTutorById` would hand Query the function with no id.
    queryFn: () => fetchTutorById(tutorId!),
    enabled: tutorId !== undefined, // do not run without an id
  });

  // The whole schedule, under the SAME key the Sessions page uses -- so
  // arriving here from that page costs no request at all.
  const { data: sessions } = useQuery<ApiSession[]>({
    queryKey: ["sessions"],
    queryFn: fetchSessions,
  });

  // Filtered here rather than by the server: see the note in api/client.ts --
  // json-server's ?tutorId= filter cannot match a string id.
  const tutorSessions = sessions?.filter((s) => s.tutorId === tutorId);

  if (isPending) {
    return (
      <div className="h-40 animate-pulse rounded-3xl border border-slate-200/60 bg-white/40 dark:border-slate-800/80 dark:bg-slate-900/30" />
    );
  }

  // REPLACES the old `if (tutor === undefined)` block: a bad id makes
  // fetchTutorById throw, and the throw lands here instead.
  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-950/20 p-5">
        <h2 className="text-sm font-bold text-red-700 dark:text-red-400">
          {error.message}
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
        {tutorSessions && tutorSessions.length > 0 ? (
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
