import type { TutoringUser } from "../types/index";
import React from "react";

export interface TutorCardProps {
    tutor: TutoringUser;
    onSelect: (tutor: TutoringUser) => void;
    variant?: "default" | "compact";
}

export default function TutorCard({ tutor, onSelect, variant = "default" }: TutorCardProps) {
    const handleSelectClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        onSelect(tutor);
    };

    const isCompact = variant === "compact";

    return (
        <div className={`relative bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/80 p-5 rounded-3xl flex flex-col gap-4 transition-all duration-300 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900/50 hover:-translate-y-0.5 ${
            isCompact ? "p-4 gap-3" : "p-5 gap-4"
        }`}>
            {/* Status dot indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5">
                <span 
                    className={`h-2 w-2 rounded-full ${tutor.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-350 dark:bg-slate-650"}`} 
                    title={tutor.isActive ? "Active Now" : "Offline"} 
                />
            </div>

            {/* Header info */}
            <div className="flex items-center gap-3">
                <div className={`rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center shadow-sm shrink-0 ${
                    isCompact ? "w-10 h-10 text-base" : "w-12 h-12 text-lg"
                }`}>
                    {tutor.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col text-left overflow-hidden">
                    <h3 className={`font-bold text-slate-900 dark:text-slate-50 truncate ${
                        isCompact ? "text-sm" : "text-base"
                    }`}>{tutor.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-1.5 py-0.5 rounded">
                            {tutor.role}
                        </span>
                        {!tutor.isActive && (
                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                Offline
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Bio description (Default view only) */}
            {!isCompact && (
                tutor.bio ? (
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed text-left">
                        {tutor.bio}
                    </p>
                ) : (
                    <p className="text-sm text-slate-400 dark:text-slate-500 italic text-left">
                        No bio available for this user.
                    </p>
                )
            )}

            {/* Subjects listing (Default view only) */}
            {!isCompact && tutor.subjects && tutor.subjects.length > 0 && (
                <div className="flex flex-col gap-1.5 text-left">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        Expertise
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                        {tutor.subjects.map((subject) => (
                            <span 
                                key={subject} 
                                className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-2.5 py-1 rounded-xl border border-slate-200/40 dark:border-slate-700/40 font-medium"
                            >
                                {subject}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Action button */}
            <div className="mt-auto">
                <button 
                    onClick={handleSelectClick}
                    className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors duration-200 cursor-pointer shadow-sm ${
                        isCompact ? "py-2 text-[11px] rounded-xl" : "py-2.5 text-xs rounded-2xl"
                    }`}
                >
                    View Schedule
                </button>
            </div>
        </div>
    );
}

