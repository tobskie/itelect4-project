// src/pages/TutorsPage.tsx
// GT2's "Tutors Directory" column, now a page of its own.
import { useNavigate } from "react-router";
import type { TutoringUser } from "../types/index";
import TutorCard from "../components/TutorCard";
import { allTutors } from "../data/mockData";
import useBookingStore from "../store/bookingStore";

function TutorsPage() {
  const navigate = useNavigate();
  const cardVariant = useBookingStore((state) => state.cardVariant);

  // useNavigate() from INSIDE an event handler. TutorCard already hands us the
  // whole tutor through onSelect, so selecting one sends us to its URL.
  // Never call navigate() in the component body -- that loops forever.
  const handleSelectTutor = (tutor: TutoringUser): void => {
    navigate(`/tutors/${tutor.id}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
          <span className="text-xl">👥</span> Tutors Directory
        </h2>
        <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
          {allTutors.length} available
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allTutors.map((tutor) => (
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
