/* ===== PART 1 -- CLASS DEMO (hidden for now) =====
import type { User, Course, Submission } from "../types/index";

// ===== PRIMITIVE TYPE ANNOTATIONS =====
// Variables with explicit types
const projectName: string = "itelect4-project";
const currentYear: number = 2026;
const isFullStack: boolean = true;
const nothing: null = null;
const notSet: undefined = undefined;

// Function: typed parameters + typed return value
function greet(name: string, year: number): string {
    return `Welcome to ${name} -- AY ${year}!`;
}

// void: function that does NOT return a value
function logMessage(message: string): void {
    console.log(message);
}
logMessage(greet(projectName, currentYear));

// ===== SPECIAL TYPES =====
// any -- disables TypeScript type checking
// [!] Avoid using this; it defeats the purpose of TypeScript
let anything: any = "hello";
anything = 42; // No error
anything = true; // No error
// unknown -- the safer version of any
// You MUST check the type before using it
let userInput: unknown = "test";
if (typeof userInput === "string") {
    console.log(userInput.toUpperCase()); // OK -- TypeScript knows it's a string here
}
// never -- a function that NEVER returns
// Used when a function always throws an error or loops forever
function throwError(message: string): never {
    throw new Error(message);
}

// ===== USING INTERFACES =====
const student: User = {
    id: 1,
    name: "Juan dela Cruz",
    email: "juan@example.com",
    role: "student",
    isActive: true,
};
const course: Course = {
    code: "Calculus",
    title: "Calculus",
    units: 3,
    semester: "1st Semester 2026-2027",
};
console.log(student);
console.log(course);

// ===== TYPE NARROWING =====
import type { StringOrNumber } from "../types/index";
// Narrowing with typeof
// Without the if-check, TypeScript would error:
// Property 'toUpperCase' does not exist on type 'number'
function processInput(input: StringOrNumber): string {
    if (typeof input === "string") {
        return input.toUpperCase(); // TypeScript knows: input is string here
    }
    return input.toFixed(2); // TypeScript knows: input is number here
}
// Narrowing with instanceof
// Used with class instances like Date, Error, etc.
function formatDate(value: string | Date): string {
    if (value instanceof Date) {
        return value.toLocaleDateString(); // TypeScript knows: it's a Date
    }
    return value; // TypeScript knows: it's a string
}
console.log(processInput("hello")); // HELLO
console.log(processInput(3.14159)); // 3.14
console.log(formatDate(new Date())); // e.g. 7/4/2026

// ===== GENERIC FUNCTIONS =====
// T is inferred automatically from whatever array you pass in
function getFirst<T>(items: T[]): T | undefined {
    return items[0];
}
// Constrained generic -- T must have an "id: number" field
function getById<T extends { id: number }>(
    items: T[],
    id: number
): T | undefined {
    return items.find((item) => item.id === id);
}
// [student] is an array containing one element
const firstUser = getFirst<User>([student]);
const foundUser = getById<User>([student], 1);
// Each ?. checks whether the object on its left exists before trying to access the next property, preventing errors if any part of the chain is null or undefined.
console.log(firstUser?.name); // Juan dela Cruz
console.log(foundUser?.email); // juan@example.com

// ===== GENERIC INTERFACE: ApiResponse<T> =====
import type { ApiResponse } from "../types/index";
const userResponse: ApiResponse<User> = {
    success: true,
    data: student,
};
const courseResponse: ApiResponse<Course[]> = {
    success: true,
    data: [course],
};
console.log(userResponse.data.name); // Juan dela Cruz

// ===== USING UTILITY TYPES =====
import type { UserUpdate, UserPreview, PublicUser, RoleCount } from "../types/index";
// Partial<T> -- update payload only needs the changed fields
const patch: UserUpdate = { name: "Juan D. Cruz" };
// Pick<T,K> -- a lightweight preview object
const preview: UserPreview = { id: 1, name: "Juan dela Cruz", role: "student" };
// Omit<T,K> -- safe to expose publicly (no email, no isActive)
const publicProfile: PublicUser = { id: 1, name: "Juan dela Cruz", role: "student" };
// Record<K,T> -- dashboard-style counts
const roleCount: RoleCount = { student: 45, admin: 2, instructor: 3 };
// ===== ReturnType<T> =====
function makeSubmission(courseCode: string) {
    return { id: 1, studentId: 1, courseCode, submittedAt: new Date() };
}
// Infer the shape directly from the function -- no need to redeclare it
type NewSubmission = ReturnType<typeof makeSubmission>;
const gt1Submission: NewSubmission = makeSubmission("ITELECT4");

// ===== USING ENUMS (Part 1 -- class demo) =====
import { SubmissionStatus, Role } from "../types/index";
let status: SubmissionStatus = SubmissionStatus.Pending;
console.log(SubmissionStatus[status]); // "Pending" -- reverse mapping
status = SubmissionStatus.Graded;
console.log(status === SubmissionStatus.Graded); // true
const currentRole: Role = Role.Student;
console.log(currentRole); // "student"
===== END PART 1 ===== */

// ============================================================
// ----- PEER TUTORING BOOKING PLATFORM -- GT1 Demo -----
// ============================================================
import type {
    TutoringUser,
    Session,
    Booking,
    TutoringUserUpdate,
    TutoringUserCard,
    PublicTutoringUser,
    BookingStatusCount,
    SessionUpdate,
    DurationFormatter,
    TutorWithStats,
    ApiResponse,
} from "../types/index";
import { BookingStatus, UserRole } from "../types/index";

console.log("=========================================");
console.log("     PEER TUTORING BOOKING PLATFORM      ");
console.log("=========================================\n");

// ===== USING CORE INTERFACES =====
const tutor: TutoringUser = {
    id: 1,
    name: "Toby",
    email: "tobster@example.com",
    role: "tutor",
    isActive: true,
    bio: "4th yr BSIT Student",
    subjects: ["ITELECT4"],
};
const tutee: TutoringUser = {
    id: 2,
    name: "Anton",
    email: "antonphilippeolimpo@example.com",
    role: "tutee",
    isActive: true,
};
const session: Session = {
    id: 101,
    tutorId: tutor.id,
    subject: "ITELECT4",
    description: "IT Elective 4",
    scheduledAt: new Date("2026-07-20T14:00:00"),
    durationMinutes: 60,
    maxSlots: 3,
};
const booking: Booking = {
    id: 201,
    sessionId: session.id,
    tuteeId: tutee.id,
    status: BookingStatus.Requested,
    requestedAt: new Date(),
};
console.log("\n=== USERS ===");
console.log(tutor);
console.log(tutee);

console.log("\n=== SESSIONS ===");
console.log(session);

console.log("\n=== BOOKINGS ===");
console.log(booking);

// ===== USING ENUMS (Tutoring Platform) =====
console.log("\nBOOKING STATUS");
let bookingStatus: BookingStatus = BookingStatus.Requested;
console.log(`Booking ID: #${booking.id}`);
console.log(`Status: ${BookingStatus[bookingStatus]}`);

bookingStatus = BookingStatus.Confirmed;
console.log(`Booking ID: #${booking.id}`);
console.log(`Status: ${BookingStatus[bookingStatus]}`);

bookingStatus = BookingStatus.Completed;
console.log(`Booking ID: #${booking.id}`);
console.log(`Status: ${BookingStatus[bookingStatus]}`);

// console.log("\n=== USER ROLES ===");
const currentUserRole: UserRole = UserRole.Tutor;
// console.log(currentUserRole); // "tutor"

// ===== GENERIC FUNCTIONS (Tutoring entities) =====
// console.log("\n=== GENERICS (FUNCTIONS) ===");
function getFirstTutor<T>(items: T[]): T | undefined {
    return items[0];
}
function getSessionById<T extends { id: number }>(
    items: T[],
    id: number
): T | undefined {
    return items.find((item) => item.id === id);
}
// ReturnType<T> -- infer the shape from a factory function
function makeBooking(sessionId: number, tuteeId: number) {
    return {
        id: Date.now(),
        sessionId,
        tuteeId,
        status: BookingStatus.Requested,
        requestedAt: new Date(),
    };
}
type NewBooking = ReturnType<typeof makeBooking>;
const testBooking: NewBooking = makeBooking(101, 2);

const users: TutoringUser[] = [tutor, tutee];
const firstTutor = getFirstTutor<TutoringUser>(users);
const foundSession = getSessionById<Session>([session], 101);
// console.log(firstTutor?.name);    // Maria Santos
// console.log(foundSession?.subject); // Calculus

// ===== GENERIC INTERFACE: ApiResponse<T> (Tutoring) =====
// console.log("\n=== GENERIC INTERFACES ===");
const tutorResponse: ApiResponse<TutoringUser> = {
    success: true,
    data: tutor,
};
const sessionListResponse: ApiResponse<Session[]> = {
    success: true,
    data: [session],
    message: "1 session found.",
};
// console.log(tutorResponse.data.name);          // Maria Santos
// console.log(sessionListResponse.data.length);  // 1

// ===== USING UTILITY TYPES (Tutoring) =====
// console.log("\n=== UTILITY TYPES & FORMATTERS ===");
// Partial<TutoringUser> -- patch payload only needs changed fields
const tutorPatch: TutoringUserUpdate = { bio: "Updated bio.", subjects: ["Physics"] };
// Pick<TutoringUser, ...> -- lightweight card for search results
const tutorCard: TutoringUserCard = {
    id: tutor.id,
    name: tutor.name,
    role: "tutor",
    subjects: ["Calculus", "Data Structures"],
};
// Omit<TutoringUser, ...> -- safe public profile
const publicTutor: PublicTutoringUser = {
    id: tutor.id,
    name: tutor.name,
    role: "tutor",
    bio: "4th yr BSIT Student",
    subjects: ["ITELECT4"],
};
// Record<K, number> -- booking dashboard counts
const bookingStatusCount: BookingStatusCount = {
    requested: 5,
    confirmed: 3,
    completed: 12,
    cancelled: 1,
};
// Partial<Session> -- edit only changed fields
const sessionPatch: SessionUpdate = { durationMinutes: 90 };

// DurationFormatter -- typed function alias
const formatDuration: DurationFormatter = (minutes) =>
    `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
// console.log(formatDuration(90)); // 1h 30m

// Intersection type -- TutorWithStats
// console.log("\n=== INTERSECTION TYPES ===");
const tutorWithStats: TutorWithStats = {
    ...tutor,
    upcomingSessionCount: 4,
    avgRating: 4.8,
};
// console.log(`${tutorWithStats.name} | Rating: ${tutorWithStats.avgRating}`);