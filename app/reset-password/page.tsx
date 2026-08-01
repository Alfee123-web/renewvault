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
    <AuthShell centered>
      <AuthCard>
        <div className="text-center">
          <h2 className="text-lg font-semibold">Reset password</h2>
          <p className="mt-0.5 text-xs text-[var(--secondary-text)]">
            Choose a new password for your account.
          </p>
        </div>

        <div className="mt-5">
          <ResetPasswordForm token={token ?? ""} />
        </div>
      </AuthCard>
    </AuthShell>
  );
}