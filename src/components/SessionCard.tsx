import type { Session } from "../types/index";
import React from "react";

export interface SessionCardProps {
    session: Session;
    tutorName: string;
    onBook: (sessionId: number) => void;
    variant?: "default" | "compact";
}

export default function SessionCard({ session, tutorName, onBook, variant = "default" }: SessionCardProps) {
    const handleBookClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        onBook(session.id);
    };

    const isCompact = variant === "compact";

    return (
        <div className={`bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/80 rounded-3xl flex flex-col transition-all duration-300 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900/50 hover:-translate-y-0.5 ${
            isCompact ? "p-4 gap-2.5" : "p-5 gap-4"
        }`}>
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-lg">
                    {session.subject}
                </span>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                    Slots: {session.maxSlots}
                </span>
            </div>
            
            <h4 className={`font-bold text-slate-900 dark:text-slate-50 text-left line-clamp-2 ${
                isCompact ? "text-sm min-h-0 line-clamp-1" : "text-base min-h-[3rem]"
            }`}>
                {session.description}
            </h4>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 text-left">
                Hosted by: <strong className="text-slate-700 dark:text-slate-355">{tutorName}</strong>
            </p>
            
            {isCompact ? (
                /* Compact Inline Details */
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/20 px-2.5 py-1.5 rounded-xl border border-slate-200/10 dark:border-slate-800/10">
                    <span>📅 {session.scheduledAt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    <span>•</span>
                    <span>🕒 {session.scheduledAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>•</span>
                    <span>⏳ {session.durationMinutes}m</span>
                </div>
            ) : (
                /* Full Details Grid */
                <div className="grid grid-cols-2 gap-2.5 bg-slate-50 dark:bg-slate-950/30 p-3 rounded-2xl border border-slate-200/20 dark:border-slate-800/20">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                        <span className="text-sm">📅</span>
                        <span>
                            {session.scheduledAt.toLocaleDateString(undefined, { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric' 
                            })}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                        <span className="text-sm">🕒</span>
                        <span>
                            {session.scheduledAt.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                            })}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 col-span-2">
                        <span className="text-sm">⏳</span>
                        <span>{session.durationMinutes} minutes duration</span>
                    </div>
                </div>
            )}
            
            <div className="mt-auto">
                <button 
                    className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors duration-250 cursor-pointer shadow-sm ${
                        isCompact ? "py-1.5 text-[11px] rounded-xl" : "py-2.5 text-xs rounded-2xl"
                    }`}
                    onClick={handleBookClick}
                >
                    Book Session
                </button>
            </div>
        </div>
    );
}

