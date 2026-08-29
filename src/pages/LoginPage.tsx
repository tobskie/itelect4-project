// src/pages/LoginPage.tsx
// There is no real password -- typing a name is enough to mint a demo token.
// SESSION 8: the hand-rolled input and button are replaced by the shadcn ones,
// the second page that uses them. This form keeps its useState on purpose: one
// field with one rule needs no schema, and knowing when NOT to reach for the
// heavier tool is part of the point.
import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Your name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
      </div>

      <Button
        onClick={handleLogin}
        disabled={name === ""}
        className="mt-4 w-full"
      >
        Log In
      </Button>
    </div>
  );
}

export default LoginPage;
