// src/components/BookingRequestForm.tsx -- a NEW file
// SESSION 8: the booking form. Before this, requesting a session was one
// fieldless button click and the note was typed in afterwards; nothing about
// the request was ever checked. Now every value is validated before the POST.
//
// There is no useState in this file. One useForm call replaces all of it --
// the values, the touched flags, the error messages and the reset.
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema } from "@/schemas/bookingSchema";
import type { BookingFormValues } from "@/schemas/bookingSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ApiSession } from "../types/index";
import useRequestBooking from "../hooks/useRequestBooking";

interface BookingRequestFormProps {
  sessions: ApiSession[];
  onResult: (message: string) => void;
}

export default function BookingRequestForm({
  sessions,
  onResult,
}: BookingRequestFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingFormValues>({
    // The resolver is the adapter between the two libraries: React Hook Form
    // hands it the values, it runs them through Zod, and hands back either
    // clean data or the errors below. Without it, useForm knows no rules.
    resolver: zodResolver(bookingSchema),
    // "onBlur" checks a field when you LEAVE it, so you are told before you
    // ever reach the button. "onChange" would shout at the first keystroke.
    mode: "onBlur",
    // The only reason reset() has something to return the fields TO.
    defaultValues: {
      sessionId: "",
      contactEmail: "",
      notes: "",
      preferredDate: "",
    },
  });

  const { requestBooking, isSaving } = useRequestBooking({
    onSaved: () => reset(),
  });

  // handleSubmit runs validation FIRST. If anything fails, this function is
  // never called -- which is why an invalid submit sends no request at all.
  const onSubmit = (values: BookingFormValues): void => {
    // values is BookingFormValues, already checked. The submit path still ends
    // in the Session 7 mutation.
    onResult(requestBooking(values));
  };

  // One row of the form: label, control, and its own error message.
  const fieldError = (message?: string) =>
    message ? (
      <p role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">
        {message}
      </p>
    ) : null;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/20 backdrop-blur-md p-6 shadow-sm"
    >
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Request a Booking
        </h3>
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          Every field is checked before anything is sent.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* SESSION */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sessionId">Session</Label>
          <select
            id="sessionId"
            aria-invalid={errors.sessionId ? true : undefined}
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
            {...register("sessionId")}
          >
            <option value="">Choose a session...</option>
            {sessions.map((session) => (
              <option key={session.id} value={session.id}>
                {session.subject} -- {session.description}
              </option>
            ))}
          </select>
          {fieldError(errors.sessionId?.message)}
        </div>

        {/* CONTACT EMAIL */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contactEmail">Your email</Label>
          <Input
            id="contactEmail"
            type="email"
            placeholder="you@example.com"
            aria-invalid={errors.contactEmail ? true : undefined}
            {...register("contactEmail")}
          />
          {fieldError(errors.contactEmail?.message)}
        </div>

        {/* PREFERRED DATE */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="preferredDate">Preferred date</Label>
          <Input
            id="preferredDate"
            type="date"
            aria-invalid={errors.preferredDate ? true : undefined}
            {...register("preferredDate")}
          />
          {fieldError(errors.preferredDate?.message)}
        </div>

        {/* NOTES */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="notes">What do you need covered?</Label>
          <Input
            id="notes"
            type="text"
            placeholder="E.g., recursion and Big-O notation"
            aria-invalid={errors.notes ? true : undefined}
            {...register("notes")}
          />
          {fieldError(errors.notes?.message)}
        </div>
      </div>

      {/* NOT disabled on invalid: clicking is what reveals the messages, so
          disabling the button would hide the very thing the user needs. It is
          disabled only while the POST is actually in flight. */}
      <Button type="submit" disabled={isSaving} className="self-start">
        {isSaving ? "Sending..." : "Request Booking"}
      </Button>
    </form>
  );
}
