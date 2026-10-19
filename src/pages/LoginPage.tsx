// src/pages/LoginPage.tsx
// ===== SESSIONS 6-8: a name, and a token this page made up ===============
//   const [name, setName] = useState<string>("");
//   const handleLogin = (): void => {
//     login(name);           // 1. put the token in the store
//     navigate("/bookings"); // 2. then send them to the page the guard protects
//   };
//
// NOTE: There was nothing to get wrong, so there was nothing to report. Now
//       the password can be wrong, the email unknown, and the API unreachable
//       -- three failures the page has to be able to show.
// ===== GT4 PART 2: email and password, checked by the API ================
import { useNavigate, Link } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuthStore from "../store/authStore";
import { loginUser } from "../api/client";
import { loginSchema } from "../schemas/authSchema";
import type { LoginFormValues } from "../schemas/authSchema";

function LoginPage() {
  const setSession = useAuthStore((state) => state.setSession);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });

  // Logging in is a POST that changes something on the server, so it is a
  // mutation and not a query -- the same useMutation the booking form uses.
  const logIn = useMutation({
    mutationFn: loginUser,
    onSuccess: (reply) => {
      // The token came from the API this time. The store just keeps it.
      setSession(reply.token, reply.user.name);
      navigate("/bookings");
    },
  });

  const onSubmit = (values: LoginFormValues): void => {
    logIn.mutate(values);
  };

  const fieldError = (message?: string) =>
    message ? (
      <p role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">
        {message}
      </p>
    ) : null;

  return (
    <div className="max-w-sm rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/20 backdrop-blur-md p-6 shadow-sm">
      <h2 className="mb-1 text-2xl font-bold text-slate-900 dark:text-slate-50">
        Login
      </h2>
      <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
        Sign in to view and manage your bookings.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            aria-invalid={errors.email ? true : undefined}
            {...register("email")}
          />
          {fieldError(errors.email?.message)}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          {/* type="password" hides the characters as they are typed. */}
          <Input
            id="password"
            type="password"
            aria-invalid={errors.password ? true : undefined}
            {...register("password")}
          />
          {fieldError(errors.password?.message)}
        </div>

        <Button type="submit" disabled={logIn.isPending} className="w-full">
          {logIn.isPending ? "Signing in..." : "Log In"}
        </Button>
      </form>

      {/* The API's own sentence, not one written here. A wrong password and
          an unknown email both answer "Email or password is incorrect" --
          deliberately the same message for both. */}
      {logIn.isError && (
        <p role="alert" className="mt-4 text-xs font-semibold text-red-700 dark:text-red-400">
          {logIn.error.message}
        </p>
      )}

      <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">
        No account yet?{" "}
        <Link to="/register" className="font-semibold text-indigo-600 dark:text-indigo-400">
          Register
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;
