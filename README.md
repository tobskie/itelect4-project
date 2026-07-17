# PeerConnect – Peer Tutoring Booking Platform

A TypeScript-based platform where students can sign up as tutors or tutees, post and discover tutoring sessions, and manage bookings through a clear status lifecycle (Requested → Confirmed → Completed). Built as a GT1 project for IT Elective 4 (AY 2026-2027) to demonstrate core TypeScript features including interfaces, enums, generics, type narrowing, and utility types.

## Interfaces & Types

Defined in `types/index.ts`:

**Class Demo (Part 1)**
- `User` – user profile with a role field (`student | admin | instructor`)
- `Course` – course subject details
- `Submission` – assignment submission with an optional score
- `SubmissionStatus` – enum: `Pending | Graded | Late`
- `Role` – const enum: `Student | Admin | Instructor`
- `ApiResponse<T>` – generic wrapper for API responses
- `UserUpdate`, `UserPreview`, `PublicUser`, `RoleCount` – utility types

**Tutoring Platform (GT1)**
- `TutoringUser` – platform user with a role field (`tutor | tutee | admin`)
- `Session` – tutoring session posted by a tutor
- `Booking` – a tutee's booking tied to a session
- `BookingStatus` – enum: `Requested | Confirmed | Completed | Cancelled`
- `UserRole` – const enum: `Tutor | Tutee | Admin`
- `TutoringUserUpdate`, `TutoringUserCard`, `PublicTutoringUser`, `BookingStatusCount`, `SessionUpdate` – utility types
- `TutorWithStats` – intersection type adding live stats to a tutor
- `DurationFormatter` – function type alias

## Setup & Running

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the app:
   ```bash
   npx ts-node src/index.ts
   ```
