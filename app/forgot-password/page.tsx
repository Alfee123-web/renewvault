import { AuthShell } from "@/app/components/auth/auth-shell";
import { AuthCard } from "@/app/components/auth/auth-card";
import { ForgotPasswordForm } from "@/app/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <AuthCard>
        <h2 className="text-2xl font-semibold">Forgot password</h2>
        <p className="mt-2 text-sm text-[var(--text-body)]">
          Enter your email and we&apos;ll send you a password reset link.
        </p>

        <div className="mt-6">
          <ForgotPasswordForm />
        </div>
      </AuthCard>
    </AuthShell>
  );
}