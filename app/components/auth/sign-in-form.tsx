"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    root?: string;
  }>({});

  function validate() {
    const nextErrors: {
      email?: string;
      password?: string;
      root?: string;
    } = {};

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password.trim()) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    return nextErrors;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      console.log({ email, password, remember });
    } catch {
      setErrors({ root: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    await signIn("google", { callbackUrl: "/dashboard" });
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5">
      {errors.root && (
        <p className="rounded-[12px] border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errors.root}
        </p>
      )}

      <div>
        <label htmlFor="email" className="mb-2 block text-sm text-[var(--text-secondary)]">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={
            errors.email ? "border-red-500/50 focus:border-red-400 focus:ring-red-500/20" : ""
          }
        />
        {errors.email && (
          <p id="email-error" className="mt-2 text-sm text-red-400">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm text-[var(--text-secondary)]">
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
          className={
            errors.password ? "border-red-500/50 focus:border-red-400 focus:ring-red-500/20" : ""
          }
        />
        {errors.password && (
          <p id="password-error" className="mt-2 text-sm text-red-400">
            {errors.password}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 accent-[var(--accent)]"
          />
          Remember me
        </label>

        <button type="button" className="text-[var(--accent)] hover:underline">
          Forgot password?
        </button>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>

      <div className="flex items-center gap-3 py-1">
        <div className="h-px flex-1 bg-[var(--border)]" />
        <span className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
          or
        </span>
        <div className="h-px flex-1 bg-[var(--border)]" />
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="flex w-full items-center justify-center rounded-[14px] border border-[var(--border)] bg-transparent px-4 py-3 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--surface-2)]"
      >
        Continue with Google
      </button>

      <p className="pt-2 text-center text-sm text-[var(--text-body)]">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="text-[var(--accent)] hover:underline">
          Sign up
        </Link>
      </p>

      <p className="text-center text-xs text-[var(--text-muted)]">
        Password must be at least 8 characters.
      </p>
    </form>
  );
}