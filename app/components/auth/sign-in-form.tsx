"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const nextErrors: { email?: string; password?: string } = {};

    if (!email.trim()) nextErrors.email = "Email is required.";
    if (!password.trim()) nextErrors.password = "Password is required.";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    console.log({ email, password, remember });
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5">
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

      <Button type="submit" className="w-full">
        Sign in
      </Button>

      <button
        type="button"
        className="flex w-full items-center justify-center rounded-[14px] border border-[var(--border)] bg-transparent px-4 py-3 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--surface-2)]"
      >
        Continue with Google
      </button>
    </form>
  );
}