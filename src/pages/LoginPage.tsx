// src/pages/LoginPage.tsx
// There is no real password -- typing a name is enough to mint a demo token.
import { useState } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "../store/authStore";

function LoginPage() {
  const [name, setName] = useState<string>("");

  // Pull just the login action out of the store
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = (): void => {
    login(name);          // 1. put the token in the store
    navigate("/bookings"); // 2. then send them to the page the guard protects
  };

  return (
    <div className="max-w-sm rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/20 backdrop-blur-md p-6 shadow-sm">
      <h2 className="mb-1 text-2xl font-bold text-slate-900 dark:text-slate-50">
        Login
      </h2>
      <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
        Sign in to view and manage your bookings.
      </p>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500"
      />

      <button
        onClick={handleLogin}
        disabled={name === ""}
        className="mt-3 w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed dark:disabled:bg-slate-800 px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 cursor-pointer"
      >
        Log In
      </button>
    </div>
  );
}

export default LoginPage;
