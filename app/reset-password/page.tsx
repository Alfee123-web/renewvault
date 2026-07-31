import { AuthShell } from "@/app/components/auth/auth-shell";
import { AuthCard } from "@/app/components/auth/auth-card";
import { ResetPasswordForm } from "@/app/components/auth/reset-password-form";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <AuthShell>
      <AuthCard>
        <h2 className="text-2xl font-semibold">Reset password</h2>
        <p className="mt-2 text-sm text-[var(--text-body)]">
          Set a new password for your account.
        </p>

        <div className="mt-6">
          <ResetPasswordForm token={token ?? ""} />
        </div>
      </AuthCard>
    </AuthShell>
  );
}