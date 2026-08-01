import { AuthShell } from "@/app/components/auth/auth-shell";
import { AuthCard } from "@/app/components/auth/auth-card";
import { ForgotPasswordForm } from "@/app/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthShell centered>
      <AuthCard>
        <div className="text-center">
          <h2 className="text-lg font-semibold">Forgot password</h2>
          <p className="mt-0.5 text-xs text-[var(--secondary-text)]">
            Enter your email and we&apos;ll send you a password reset link.
          </p>
        </div>

        <div className="mt-5">
          <ForgotPasswordForm />
        </div>
      </AuthCard>
    </AuthShell>
  );
}