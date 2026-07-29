"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

export function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    root?: string;
  }>({});

  function validate() {
    const nextErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      root?: string;
    } = {};

    if (!name.trim()) {
      nextErrors.name = "Name is required.";
    } else if (name.trim().length < 2) {
      nextErrors.name = "Name must be at least 2 characters.";
    }

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

    if (!confirmPassword.trim()) {
      nextErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
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
      console.log({ name, email, password, confirmPassword });
    } catch {
      setErrors({ root: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsGoogleSigningIn(true);
    await signIn("google", { callbackUrl: "/dashboard" });
    setIsGoogleSigningIn(false);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5">
      {errors.root && (
        <p className="rounded-[12px] border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errors.root}
        </p>
      )}

      <div>
        <label htmlFor="name" className="mb-2 block text-sm text-[var(--text-secondary)]">
          Full name
        </label>
        <Input
          id="name"
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={errors.name ? "border-red-500/50 focus:border-red-400 focus:ring-red-500/20" : ""}
        />
        {errors.name && (
          <p id="name-error" className="mt-2 text-sm text-red-400">
            {errors.name}
          </p>
        )}
      </div>

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
          className={errors.email ? "border-red-500/50 focus:border-red-400 focus:ring-red-500/20" : ""}
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
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
          className={errors.password ? "border-red-500/50 focus:border-red-400 focus:ring-red-500/20" : ""}
        />
        {errors.password && (
          <p id="password-error" className="mt-2 text-sm text-red-400">
            {errors.password}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-2 block text-sm text-[var(--text-secondary)]">
          Confirm password
        </label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
          className={errors.confirmPassword ? "border-red-500/50 focus:border-red-400 focus:ring-red-500/20" : ""}
        />
        {errors.confirmPassword && (
          <p id="confirm-password-error" className="mt-2 text-sm text-red-400">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Create account"}
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
        disabled={isGoogleSigningIn}
        className="flex w-full items-center justify-center rounded-[14px] border border-[var(--border)] bg-transparent px-4 py-3 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--surface-2)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isGoogleSigningIn ? "Opening Google..." : "Continue with Google"}
      </button>

      <p className="pt-2 text-center text-sm text-[var(--text-body)]">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-[var(--accent)] hover:underline">
          Sign in
        </Link>
      </p>

      <p className="text-center text-xs text-[var(--text-muted)]">
        Password must be at least 8 characters.
      </p>
    </form>
  );
}