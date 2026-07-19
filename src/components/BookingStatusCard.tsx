import type { Booking } from "../types/index";
import { BookingStatus } from "../types/index";
import React from "react";

export interface BookingStatusCardProps {
    booking: Booking;
    subjectName: string;
    tuteeName: string;
    onCancel: (bookingId: number) => void;
    onNotesChange: (bookingId: number, notes: string) => void;
}

export default function BookingStatusCard({
    booking,
    subjectName,
    tuteeName,
    onCancel,
    onNotesChange
}: BookingStatusCardProps) {
    const handleCancelClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        onCancel(booking.id);
    };

    const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        onNotesChange(booking.id, e.target.value);
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

    const getStatusClass = (status: BookingStatus): string => {
        switch (status) {
            case BookingStatus.Requested:
                return "status-requested";
            case BookingStatus.Confirmed:
                return "status-confirmed";
            case BookingStatus.Completed:
                return "status-completed";
            case BookingStatus.Cancelled:
                return "status-cancelled";
            default:
                return "";
        }
    };

    return (
        <div className="booking-card">
            <div className="booking-header">
                <span className="booking-id">Booking #{booking.id}</span>
                <span className={`booking-status-badge ${getStatusClass(booking.status)}`}>
                    {getStatusLabel(booking.status)}
                </span>
            </div>
            <div className="booking-info">
                <p><strong>Subject:</strong> {subjectName}</p>
                <p><strong>Tutee:</strong> {tuteeName}</p>
                <p className="booking-date"><strong>Requested:</strong> {booking.requestedAt.toLocaleDateString()}</p>
            </div>
            
            <div className="booking-notes-section">
                <label htmlFor={`notes-${booking.id}`} className="notes-label">Booking Notes:</label>
                <input 
                    id={`notes-${booking.id}`}
                    type="text" 
                    className="booking-notes-input"
                    value={booking.notes || ""} 
                    onChange={handleNotesChange}
                    placeholder="E.g., Topics to discuss..."
                />
            </div>

            {booking.status !== BookingStatus.Cancelled && booking.status !== BookingStatus.Completed && (
                <div className="booking-actions">
                    <button 
                        onClick={handleCancelClick}
                        className="cancel-booking-btn"
                    >
                        Cancel Booking
                    </button>
                </div>
            )}
        </div>
    );
}
