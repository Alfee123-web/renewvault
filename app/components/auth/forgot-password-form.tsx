"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ email?: string }>({});

  function validate() {
    const nextErrors: { email?: string } = {};

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    return nextErrors;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(
        data.message || "If the email exists, a reset link has been sent."
      );
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full space-y-4">
      {message && (
        <p className="rounded-[12px] border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2 text-sm text-[var(--text-body)]">
          {message}
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
          className={`bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--secondary)] focus:ring-[var(--secondary-focus-ring)] ${
            errors.email ? "border-red-500/50 focus:border-red-400 focus:ring-red-500/20" : ""
          }`}
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-xs text-red-400">
            {errors.email}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] text-white border-none"
      >
        {isSubmitting ? "Sending..." : "Send reset link"}
      </Button>
    </form>
  );
}