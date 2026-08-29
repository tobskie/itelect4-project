// src/schemas/bookingSchema.ts -- a NEW file
// SESSION 8: the rules for the "Request a Booking" form, written once and used
// twice -- Zod checks the values at runtime, and z.infer produces the
// TypeScript type at compile time. One source of truth for both.
//
// A schema is not a type. A type is erased before the code runs, so it can
// never check what a user types. This is an ordinary value that still exists
// at runtime, which is exactly why it can.
import { z } from "zod";

// Today at midnight, worked out ONCE when the module loads rather than on
// every keystroke. Midnight matters: a booking for later today is fine.
const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);

export const bookingSchema = z.object({
  // RULE 1 -- the <select> starts on "", so this is what "choose one" means.
  sessionId: z.string().min(1, "Choose a session to book."),

  // RULE 2 -- a real address, because this is how the tutor answers you.
  contactEmail: z.email("Enter a valid email address, e.g. you@example.com"),

  // RULE 3 and 4 -- long enough to be useful to the tutor, short enough to
  // stay a note. trim() first, so ten spaces is not ten characters.
  notes: z
    .string()
    .trim()
    .min(10, "Tell your tutor what you need covered -- at least 10 characters.")
    .max(200, "Keep this under 200 characters."),

  // RULE 5, then the .refine() -- "is a date" is something Zod ships;
  // "is not in the past" is not, so that rule is written as a function.
  // It runs on whatever the user typed, so it stays one boolean expression:
  // a function that throws would take validation down with it.
  preferredDate: z
    .string()
    .min(1, "Pick the date that suits you.")
    .refine(
      (value) => new Date(value) >= startOfToday,
      "That date has already passed -- pick today or later."
    ),
});

// RULE 6 (do not hand-write this) -- the type is DERIVED from the schema, so a
// field renamed above is a compile error in the form below, not a silent bug.
export type BookingFormValues = z.infer<typeof bookingSchema>;
