"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  function validate() {
    const nextErrors: { password?: string; confirmPassword?: string } = {};

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
    setMessage("");

    if (!token) {
      setMessage("Missing reset token.");
      return;
    }

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      setMessage(data.message || "Password updated successfully.");

      if (res.ok) {
        router.push("/sign-in");
      }
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
          htmlFor="password"
          className="mb-1 block text-sm text-[var(--text-secondary)]"
        >
          New password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
          autoComplete="new-password"
          className={`bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--secondary)] focus:ring-[var(--secondary-focus-ring)] ${
            errors.password ? "border-red-500/50 focus:border-red-400 focus:ring-red-500/20" : ""
          }`}
        />
        {errors.password && (
          <p id="password-error" className="mt-1 text-xs text-red-400">
            {errors.password}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1 block text-sm text-[var(--text-secondary)]"
        >
          Confirm password
        </label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
          autoComplete="new-password"
          className={`bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--secondary)] focus:ring-[var(--secondary-focus-ring)] ${
            errors.confirmPassword ? "border-red-500/50 focus:border-red-400 focus:ring-red-500/20" : ""
          }`}
        />
        {errors.confirmPassword && (
          <p id="confirm-password-error" className="mt-1 text-xs text-red-400">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || !token}
        className="w-full bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] text-white border-none"
      >
        {isSubmitting ? "Updating..." : "Reset password"}
      </Button>
    </form>
  );
}