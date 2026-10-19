// src/pages/RegisterPage.tsx -- a NEW file
// GT4 PART 2: until today nobody has ever had an account. This is the login
// form with a name field added; the only new idea is in the mutation.
import { useNavigate, Link } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuthStore from "../store/authStore";
import { registerUser, loginUser } from "../api/client";
import { registerSchema } from "../schemas/authSchema";
import type { RegisterFormValues } from "../schemas/authSchema";

function RegisterPage() {
  const setSession = useAuthStore((state) => state.setSession);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: { name: "", email: "", password: "" },
  });

  const signUp = useMutation({
    // Two requests, in order. /api/auth/register creates the user and answers
    // with it, but issues no token -- login is the only route that signs one.
    // Without the second call you would land on the login page to type the
    // same password again.
    mutationFn: async (values: RegisterFormValues) => {
      await registerUser(values);
      return loginUser({ email: values.email, password: values.password });
    },
    onSuccess: (reply) => {
      setSession(reply.token, reply.user.name);
      navigate("/bookings");
    },
  });

  const onSubmit = (values: RegisterFormValues): void => {
    signUp.mutate(values);
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
        Register
      </h2>
      <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
        Make an account to request tutoring sessions.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Juan dela Cruz"
            aria-invalid={errors.name ? true : undefined}
            {...register("name")}
          />
          {fieldError(errors.name?.message)}
        </div>

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
          <Input
            id="password"
            type="password"
            aria-invalid={errors.password ? true : undefined}
            {...register("password")}
          />
          {fieldError(errors.password?.message)}
        </div>

        <Button type="submit" disabled={signUp.isPending} className="w-full">
          {signUp.isPending ? "Creating account..." : "Register"}
        </Button>
      </form>

      {/* "That email is already registered" (409) arrives here word for word. */}
      {signUp.isError && (
        <p role="alert" className="mt-4 text-xs font-semibold text-red-700 dark:text-red-400">
          {signUp.error.message}
        </p>
      )}

      <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-400">
          Log in
        </Link>
      </p>
    </div>
  );
}

export default RegisterPage;
