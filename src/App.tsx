// src/App.tsx -- the route table, and nothing else.
// To find out what pages this app has, you read this one file.
import { Routes, Route } from "react-router";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import TutorsPage from "./pages/TutorsPage";
import TutorDetailPage from "./pages/TutorDetailPage";
import SessionsPage from "./pages/SessionsPage";
import BookingsPage from "./pages/BookingsPage";
import ReviewPage from "./pages/ReviewPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="tutors" element={<TutorsPage />} />
        <Route path="tutors/:tutorId" element={<TutorDetailPage />} />
        <Route path="sessions" element={<SessionsPage />} />
        <Route path="login" element={<LoginPage />} />
        {/* Public, like login: you cannot be logged in yet. */}
        <Route path="register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}> {/* <-- the guard */}
          <Route path="bookings" element={<BookingsPage />} />
          {/* Session 11: behind the same guard -- the API refuses it
              without a token anyway, so the page should not offer it. */}
          <Route path="review" element={<ReviewPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
