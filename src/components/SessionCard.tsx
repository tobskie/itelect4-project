import type { Session } from "../types/index";
import React from "react";

export interface SessionCardProps {
    session: Session;
    tutorName: string;
    onBook: (sessionId: number) => void;
}

export default function SessionCard({ session, tutorName, onBook }: SessionCardProps) {
    const handleBookClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        onBook(session.id);
    };

    return (
        <div className="session-card">
            <div className="session-header">
                <span className="session-subject">{session.subject}</span>
                <span className="session-slots">Max Slots: {session.maxSlots}</span>
            </div>
            <h4 className="session-title">{session.description}</h4>
            <p className="session-tutor">Hosted by: <strong>{tutorName}</strong></p>
            <div className="session-details">
                <div className="session-detail-item">
                    <span className="detail-icon">📅</span>
                    <span>{session.scheduledAt.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="session-detail-item">
                    <span className="detail-icon">🕒</span>
                    <span>{session.scheduledAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="session-detail-item">
                    <span className="detail-icon">⏳</span>
                    <span>{session.durationMinutes} mins</span>
                </div>
            </div>
            <button 
                className="book-session-btn"
                onClick={handleBookClick}
            >
                Book Session
            </button>
        </div>
    );
}
