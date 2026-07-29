import { AuthShell } from "@/app/components/auth/auth-shell";
import { AuthCard } from "@/app/components/auth/auth-card";

export default function SignUpPage() {
  return (
    <AuthShell>
      <AuthCard>
        <h2 className="text-2xl font-semibold">Sign up</h2>
        <p className="mt-2 text-sm text-[var(--text-body)]">
          Create your RenewVault account to get started.
        </p>
      </AuthCard>
    </AuthShell>
  );
}