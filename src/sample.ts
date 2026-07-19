import type { User } from "./types/index";

// sample.js -- provided for GT1 Part 1
// Task: convert to TS (rename sample.ts). Annotate all vars, params, return types

// Fetches student data by ID number
function getUser(id: number): User & { score?: number } {
  return {
    id: id,
    name: "Juan dela Cruz",
    email: "[EMAIL_ADDRESS]",
    role: "student",
    isActive: true,
    score: 95.5,
  };
}

// Converts a score into a letter grade
function calculateGrade(score: number, maxScore: number): string {
  const percentage: number = (score / maxScore) * 100;
  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B";
  if (percentage >= 70) return "C";
  return "F";
}

// Returns a formatted string with course details
function formatCourse(name: string, units: number, semester: string): string {
  return `${name} (${units} units) - ${semester}`;
}

// Execute functions and print test outputs
const user = getUser(1);
console.log(user);
console.log(calculateGrade(85, 100));
console.log(formatCourse("IT Elective 4", 3, "1st Semester"));