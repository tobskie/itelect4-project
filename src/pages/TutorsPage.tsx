// src/pages/TutorsPage.tsx
// SESSION 7: the directory is no longer an array imported from mockData -- it
// is fetched, cached and shared by the whole app under the key ["tutors"].
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import type { ApiUser } from "../types/index";
import TutorCard from "../components/TutorCard";
import { fetchTutors } from "../api/client";
import useUiStore from "../store/uiStore";

function TutorsPage() {
  const navigate = useNavigate();
  const cardVariant = useUiStore((state) => state.cardVariant);

  // These three lines replace the whole import-an-array approach. Leave this
  // page and come back and the list paints instantly, out of the cache.
  const { data, isPending, isError, error } = useQuery<ApiUser[]>({
    queryKey: ["tutors"],
    queryFn: fetchTutors,
  });

  // useNavigate() from INSIDE an event handler. TutorCard already hands us the
  // whole tutor through onSelect, so selecting one sends us to its URL.
  // Never call navigate() in the component body -- that loops forever.
  const handleSelectTutor = (tutor: ApiUser): void => {
    navigate(`/tutors/${tutor.id}`);
  };

  if (isPending) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((slot) => (
          <div
            key={slot}
            className="h-48 rounded-3xl border border-slate-200/60 bg-white/40 dark:border-slate-800/80 dark:bg-slate-900/30"
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

  // Below this line data is ApiUser[], never undefined -- the two returns above
  // ruled the other cases out, and TypeScript followed.
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
          <span className="text-xl">👥</span> Tutors Directory
        </h2>
        <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
          {data.length} available
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((tutor) => (
          <TutorCard
            key={tutor.id}
            tutor={tutor}
            onSelect={handleSelectTutor}
            variant={cardVariant}
          />
        ))}
      </div>
    </div>
  );
}

export default TutorsPage;
