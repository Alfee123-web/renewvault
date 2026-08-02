"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
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
      const result = await signIn("credentials", {
        email,
        password,
        remember: remember ? "on" : "off",
        redirect: false,
      });

      if (result?.error) {
        setErrors({ root: "Invalid email or password." });
      } else {
        router.push("/dashboard");
        router.refresh();
      }
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
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      {errors.root && (
        <p className="rounded-[12px] border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {errors.root}
        </p>
      )}

      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-sm text-[var(--text-secondary)]"
        >
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
          className={`border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--secondary)] focus:ring-[var(--secondary-focus-ring)] ${
            errors.email
              ? "border-red-500/50 focus:border-red-400 focus:ring-red-500/20"
              : ""
          }`}
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-xs text-red-400">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-sm text-[var(--text-secondary)]"
        >
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
          className={`border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--secondary)] focus:ring-[var(--secondary-focus-ring)] ${
            errors.password
              ? "border-red-500/50 focus:border-red-400 focus:ring-red-500/20"
              : ""
          }`}
        />
        {errors.password && (
          <p id="password-error" className="mt-1 text-xs text-red-400">
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
            className="h-4 w-4 accent-[var(--secondary)]"
          />
          Remember me
        </label>

        <Link
          href="/forgot-password"
          className="text-[var(--secondary-text)] hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full border-none bg-[var(--secondary)] text-white hover:bg-[var(--secondary-hover)]"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>

      <div className="flex items-center gap-3 py-0.5">
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
        className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-[14px] border border-[var(--border)] bg-transparent px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] transition-colors duration-200 hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {!isGoogleSigningIn && (
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
              fill="#4285F4"
            />
            <path
              d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
              fill="#34A853"
            />
            <path
              d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
              fill="#FBBC05"
            />
            <path
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z"
              fill="#EA4335"
            />
          </svg>
        )}
        {isGoogleSigningIn ? "Opening Google..." : "Continue with Google"}
      </button>

      <p className="pt-1 text-center text-sm text-[var(--text-body)]">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="text-[var(--secondary-text)] hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}