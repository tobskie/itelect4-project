import type { TutoringUser } from "../types/index";
import React from "react";

export interface TutorCardProps {
    tutor: TutoringUser;
    onSelect: (tutor: TutoringUser) => void;
}

export default function TutorCard({ tutor, onSelect }: TutorCardProps) {
    const handleSelectClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        onSelect(tutor);
    };

    return (
        <div className={`tutor-card ${tutor.role} ${tutor.isActive ? "active" : "inactive"}`}>
            <div className="tutor-status-dot" title={tutor.isActive ? "Active Now" : "Offline"} />
            <div className="tutor-header">
                <div className="tutor-avatar">
                    {tutor.name.charAt(0).toUpperCase()}
                </div>
                <div className="tutor-info">
                    <h3 className="tutor-name">{tutor.name}</h3>
                    <span className="tutor-role-tag">{tutor.role}</span>
                </div>
            </div>
            {tutor.bio ? (
                <p className="tutor-bio">{tutor.bio}</p>
            ) : (
                <p className="tutor-bio placeholder-bio">No bio available for this user.</p>
            )}
            {tutor.subjects && tutor.subjects.length > 0 && (
                <div className="tutor-subjects">
                    <span className="subjects-label">Expertise:</span>
                    <div className="subject-tags">
                        {tutor.subjects.map((subject) => (
                            <span key={subject} className="subject-tag">
                                {subject}
                            </span>
                        ))}
                    </div>
                </div>
            )}
            <div className="tutor-actions">
                <button 
                    onClick={handleSelectClick}
                    className="select-tutor-btn"
                >
                    View Schedule
                </button>
            </div>
        </div>
    );
}
