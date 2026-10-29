// ===== SESSION 12: a NEW file =========================================
// Test 1 of 3: a component render. The test sits beside the file it
// tests and has the same name with .test in front of .tsx.
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import BookingStatusCard from "./BookingStatusCard";
import { BookingStatus, type ApiBooking } from "../types/index";

const sampleBooking: ApiBooking = {
  id: "b101",
  sessionId: "s201",
  tuteeId: "u301",
  status: BookingStatus.Requested,
  requestedAt: "2026-10-20T10:00:00.000Z",
  notes: "Need help with integration techniques",
};

describe("BookingStatusCard", () => {
  it("shows the booking id, subject, tutee, and status", () => {
    render(
      <BookingStatusCard
        booking={sampleBooking}
        subjectName="Advanced Calculus"
        tuteeName="Juan Dela Cruz"
        onCancel={vi.fn()}
        onNotesChange={vi.fn()}
      />,
    );

    expect(screen.getByText("Booking #b101")).toBeInTheDocument();
    expect(screen.getByText("Advanced Calculus")).toBeInTheDocument();
    expect(screen.getByText("Juan Dela Cruz")).toBeInTheDocument();
    expect(screen.getByText("Requested")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Cancel Booking" }),
    ).toBeInTheDocument();
  });

  it("updates status label and hides cancel button when status is Cancelled", () => {
    const cancelledBooking: ApiBooking = {
      ...sampleBooking,
      status: BookingStatus.Cancelled,
    };

    render(
      <BookingStatusCard
        booking={cancelledBooking}
        subjectName="Advanced Calculus"
        tuteeName="Juan Dela Cruz"
        onCancel={vi.fn()}
        onNotesChange={vi.fn()}
      />,
    );

    expect(screen.getByText("Cancelled")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Cancel Booking" }),
    ).not.toBeInTheDocument();
  });
});
