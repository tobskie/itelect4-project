// SESSION 7: this booking came back from the API, so ids are strings and
// requestedAt is an ISO string rather than a Date.
import type { ApiBooking } from "../types/index";
import { BookingStatus } from "../types/index";
import React, { useState, useEffect } from "react";

export interface BookingStatusCardProps {
    booking: ApiBooking;                                    // <-- was Booking
    subjectName: string;
    tuteeName: string;
    onCancel: (bookingId: string) => void;                  // <-- string id
    onNotesChange: (bookingId: string, notes: string) => void;
    variant?: "default" | "compact";
}

export default function BookingStatusCard({
    booking,
    subjectName,
    tuteeName,
    onCancel,
    onNotesChange,
    variant = "default"
}: BookingStatusCardProps) {
    // The note is now a DRAFT held here while you type, and only sent to the
    // server when you leave the box. Firing a PATCH on every keystroke would
    // mean one request per letter.
    const [draftNotes, setDraftNotes] = useState<string>(booking.notes ?? "");

    // If the saved note changes underneath us -- a refetch after the save, or
    // another tab -- take the server's version as the new starting point.
    useEffect(() => {
        setDraftNotes(booking.notes ?? "");
    }, [booking.notes]);

    const requestedAt = new Date(booking.requestedAt);

    const handleCancelClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        onCancel(booking.id);
    };

    const handleNotesInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setDraftNotes(e.target.value);
    };

    // onBlur: the user has finished typing, so now it is worth a request.
    const handleNotesBlur = (): void => {
        if (draftNotes !== (booking.notes ?? "")) {
            onNotesChange(booking.id, draftNotes);
        }
    };

    const getStatusLabel = (status: BookingStatus): string => {
        switch (status) {
            case BookingStatus.Requested:
                return "Requested";
            case BookingStatus.Confirmed:
                return "Confirmed";
            case BookingStatus.Completed:
                return "Completed";
            case BookingStatus.Cancelled:
                return "Cancelled";
            default:
                return "Unknown";
        }
    };

    const getStatusStyles = (status: BookingStatus): string => {
        switch (status) {
            case BookingStatus.Requested:
                return "bg-amber-50 text-amber-700 border border-amber-200/50 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30";
            case BookingStatus.Confirmed:
                return "bg-emerald-50 text-emerald-700 border border-emerald-200/50 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30";
            case BookingStatus.Completed:
                return "bg-blue-50 text-blue-700 border border-blue-200/50 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30";
            case BookingStatus.Cancelled:
                return "bg-rose-50 text-rose-700 border border-rose-200/50 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30";
            default:
                return "bg-slate-50 text-slate-655 dark:bg-slate-900 dark:text-slate-400 border border-slate-200 dark:border-slate-800";
        }
    };

    const isCompact = variant === "compact";

    return (
        <div className={`bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/80 rounded-3xl flex flex-col transition-all duration-300 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900/50 ${
            isCompact ? "p-4 gap-3" : "p-5 gap-4"
        }`}>
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                    Booking #{booking.id}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getStatusStyles(booking.status)}`}>
                    {getStatusLabel(booking.status)}
                </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3.5 text-xs text-slate-600 dark:text-slate-400 text-left">
                <div className="flex flex-col justify-between sm:border-b-0 sm:pb-0 border-b border-slate-100 dark:border-slate-800/60 pb-1.5">
                    <span className="text-slate-400 dark:text-slate-500 font-semibold text-[10px] uppercase tracking-wider">Subject</span> 
                    <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{subjectName}</span>
                </div>
                <div className="flex flex-col justify-between sm:border-b-0 sm:pb-0 border-b border-slate-100 dark:border-slate-800/60 pb-1.5">
                    <span className="text-slate-400 dark:text-slate-500 font-semibold text-[10px] uppercase tracking-wider">Tutee</span> 
                    <span className="font-semibold text-slate-700 dark:text-slate-350 mt-0.5">{tuteeName}</span>
                </div>
                <div className="flex flex-col justify-between">
                    <span className="text-slate-400 dark:text-slate-500 font-semibold text-[10px] uppercase tracking-wider">Requested Date</span> 
                    <span className="font-medium text-slate-500 dark:text-slate-400 mt-0.5">{requestedAt.toLocaleDateString()}</span>
                </div>
            </div>
            
            {isCompact ? (
                /* Compact Read-Only Notes */
                booking.notes && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 italic bg-slate-50/50 dark:bg-slate-950/20 px-2.5 py-1.5 rounded-xl border border-slate-200/10 dark:border-slate-800/10 text-left">
                        Note: "{booking.notes}"
                    </div>
                )
            ) : (
                /* Default Editable Notes Input */
                <div className="flex flex-col gap-1.5 text-left mt-1">
                    <label htmlFor={`notes-${booking.id}`} className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        Booking Notes
                    </label>
                    <input 
                        id={`notes-${booking.id}`}
                        type="text" 
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-100 placeholder-slate-400 border border-slate-200/65 dark:border-slate-800/80 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-inner"
                        value={draftNotes}
                        onChange={handleNotesInputChange}
                        onBlur={handleNotesBlur}
                        placeholder="E.g., Topics to discuss..."
                    />
                </div>
            )}

            {booking.status !== BookingStatus.Cancelled && booking.status !== BookingStatus.Completed && (
                <div className="flex justify-end mt-1">
                    <button 
                        onClick={handleCancelClick}
                        className={`border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-400 dark:hover:bg-rose-950/20 font-semibold transition-colors duration-200 cursor-pointer ${
                            isCompact ? "px-3 py-1 text-[11px] rounded-lg" : "px-3.5 py-1.5 text-xs rounded-xl"
                        }`}
                    >
                        Cancel Booking
                    </button>
                </div>
            )}
        </div>
    );
}

